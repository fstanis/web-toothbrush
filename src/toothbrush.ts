import { SERVICES } from './constants'
import * as properties from './properties/index'
import { Property } from './properties/property'

export class Toothbrush {
  public static services: string[] = Object.values(SERVICES)

  public static async connect (): Promise<Toothbrush> {
    const server = await this.requestServer()
    if (!await Toothbrush.isToothbrush(server)) {
      throw new Error('Selected device is not a supported toothbrush')
    }
    return new Toothbrush(server)
  }

  public static async isToothbrush (server: BluetoothRemoteGATTServer): Promise<boolean> {
    try {
      const services = await server.getPrimaryServices()
      const serviceSet = new Set(services.map(service => service.uuid))
      console.log(Array.from(serviceSet))
      return this.services.every(service => serviceSet.has(service))
    } catch (err) {
      console.log(err.message)
      return false
    }
  }

  public static async requestServer (): Promise<BluetoothRemoteGATTServer> {
    if (!navigator.bluetooth) {
      throw new Error('This platform does not support WebBluetooth')
    }
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: this.services
    })
    if (!device || !device.gatt) {
      throw new Error('Failed to get bluetooth device')
    }
    return device.gatt.connect()
  }

  private server: BluetoothRemoteGATTServer
  private services: Map<string, Promise<BluetoothRemoteGATTService>>
  private characteristics: Map<string, BluetoothRemoteGATTCharacteristic | null>

  private properties: {
    general: { [name: string]: Property },
    configuration: { [name: string]: Property }
  }

  constructor (server: BluetoothRemoteGATTServer) {
    this.server = server
    this.characteristics = new Map()
    this.services = this.connectServices()

    this.properties = {
      general: {
        batteryLevel: new properties.general.BatteryLevelProperty(this),
        brushingTime: new properties.general.BrushingTimeProperty(this),
        buttonState: new properties.general.ButtonStateProperty(this),
        deviceType: new properties.general.DeviceTypeProperty(this),
        handleId: new properties.general.HandleIdProperty(this),
        mode: new properties.general.BrushingModeProperty(this),
        pressureSensor: new properties.general.PressureSensorProperty(this),
        quadrantProperty: new properties.general.QuadrantProperty(this),
        smiley: new properties.general.SmileyProperty(this),
        state: new properties.general.DeviceStateProperty(this),
        userAccountId: new properties.general.UserAccountIdProperty(this)
      },
      configuration: {
        brushingModes: new properties.configuration.BrushingModesProperty(this),
        brushingTimer: new properties.configuration.BrushingTimerProperty(this),
        color: new properties.configuration.ColorProperty(this),
        command: new properties.configuration.CommandProperty(this),
        data: new properties.configuration.DataProperty(this),
        flightMode: new properties.configuration.FlightModeProperty(this),
        pressure: new properties.configuration.PressureProperty(this),
        quadrantTimes: new properties.configuration.QuadrantTimesProperty(this),
        rtc: new properties.configuration.RtcProperty(this),
        timezone: new properties.configuration.TimezoneProperty(this),
        tongueTime: new properties.configuration.TongueTimeProperty(this)
      }
    }
  }

  public getProperty (name: string): Property {
    if (name in this.properties.general) {
      return this.properties.general[name]
    }
    if (name in this.properties.configuration) {
      return this.properties.configuration[name]
    }

    throw new Error(`Property "${name}" not found`)
  }

  private connectServices (): Map<string, Promise<BluetoothRemoteGATTService>> {
    const services = Toothbrush.services.map(
      (id: string): [string, Promise<BluetoothRemoteGATTService>] =>
        [id, this.server.getPrimaryService(id)]
    )
    return new Map(services)
  }

  public isConnected (): boolean {
    return this.server.connected
  }

  public async getCharacteristic (serviceId: string, id: string): Promise<BluetoothRemoteGATTCharacteristic | null> {
    if (this.characteristics.has(id)) {
      return this.characteristics.get(id)!
    }
    const service = await this.services.get(serviceId) as BluetoothRemoteGATTService
    let result
    try {
      result = await service.getCharacteristic(id)
    } catch (err) {
      result = null
    }
    this.characteristics.set(id, result)
    return result
  }
}
