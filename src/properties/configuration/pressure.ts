import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { PressureConfig } from '../../types'
import { CommandProperty } from './command'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.PRESSURE

const COMMAND_SET_PRESSURE: [number, number] = [0x37, 0x2C]

export class PressureProperty extends SimpleProperty<PressureConfig> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected decodeData (data: DataView): PressureConfig {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing PressureProperty: ${data.byteLength}`)
    }

    const state = data.getUint8(0)
    return {
      pressureSignalOn: (state & 1) === 1,
      motorSpeedReduced: (state & 2) === 2
    }
  }

  protected async preWrite (value: PressureConfig): Promise<void> {
    await this.command.writeValue(COMMAND_SET_PRESSURE)
  }

  protected encodeData (value: PressureConfig): Uint8Array {
    let state = 0
    if (value.pressureSignalOn) {
      state |= 1
    }
    if (value.motorSpeedReduced) {
      state |= 2
    }
    return new Uint8Array([state])
  }
}
