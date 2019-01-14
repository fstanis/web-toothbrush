import { WritableProperty, ReadOnlyProperty, NotifyProperty } from './property'
import { Toothbrush } from '../toothbrush'

export abstract class SimpleReadOnlyProperty<T> implements ReadOnlyProperty {
  protected characteristic: Promise<BluetoothRemoteGATTCharacteristic | null>

  protected constructor (toothbrush: Toothbrush, serviceId: string, characteristicId: string) {
    this.characteristic = toothbrush.getCharacteristic(serviceId, characteristicId)
  }

  public async isAvailable (): Promise<boolean> {
    return !!(await this.characteristic)
  }

  public async readValue (): Promise<T> {
    const characteristic = await this.characteristic
    if (!characteristic) {
      throw new Error('The property is not available on this device.')
    }
    await this.preRead()
    const data = await characteristic.readValue()
    return this.decodeData(data)
  }

  protected async preRead (): Promise<void> {}

  protected abstract decodeData (dataArray: DataView): T
}

export abstract class SimpleProperty<T> extends SimpleReadOnlyProperty<T> implements WritableProperty {
  public async writeValue (value: T): Promise<void> {
    const characteristic = await this.characteristic
    if (!characteristic) {
      throw new Error('The property is not available on this device.')
    }
    await this.preWrite(value)
    const payload = this.encodeData(value)
    return characteristic.writeValue(payload)
  }

  protected async preWrite (value: T): Promise<void> {}

  protected abstract encodeData (value: T): BufferSource
}

type ValueListener<T> = (value: T) => void

export abstract class SimpleNotifyProperty<T> extends SimpleReadOnlyProperty<T> implements NotifyProperty {
  private listeners: ValueListener<T>[] = []
  private hasEventListener: boolean = false
  protected listening: Promise<BluetoothRemoteGATTCharacteristic> | null

  protected constructor (toothbrush: Toothbrush, serviceId: string, characteristicId: string) {
    super(toothbrush, serviceId, characteristicId)
    this.listening = null
  }

  private async addEventListener (): Promise<void> {
    if (this.hasEventListener) {
      return
    }
    this.hasEventListener = true
    const characteristic = await this.characteristic
    if (!characteristic) {
      throw new Error('The property is not available on this device.')
    }
    characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
      if (!event || !event.target) {
        return
      }
      const characteristic = event.target as BluetoothRemoteGATTCharacteristic
      if (!characteristic.value) {
        return
      }
      const value: T = this.decodeData(characteristic.value)
      for (let listener of this.listeners) {
        listener(value)
      }
    })
  }

  public async addValueListener (listener: ValueListener<T>): Promise<void> {
    await this.startNotifications()
    this.listeners.push(listener)
  }

  public async startNotifications (): Promise<void> {
    const characteristic = await this.characteristic
    if (!characteristic) {
      throw new Error('The property is not available on this device.')
    }
    if (!this.listening) {
      this.listening = characteristic.startNotifications()
    }
    await this.listening
    await this.addEventListener()
  }

  public async stopNotifications (): Promise<void> {
    const characteristic = await this.characteristic
    if (!characteristic) {
      throw new Error('The property is not available on this device.')
    }
    if (this.listening) {
      await this.listening
      this.listening = null
      this.listeners = []
      await characteristic.stopNotifications()
    }
  }
}
