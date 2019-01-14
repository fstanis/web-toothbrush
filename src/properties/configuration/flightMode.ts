import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { CommandProperty } from './command'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.FLIGHT_MODE

const COMMAND_SET_FLIGHT_MODE: [number, number] = [0x37, 0x2E]

const FLIGHT_MODE_ON = 0x47

export class FlightModeProperty extends SimpleProperty<boolean> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected decodeData (data: DataView): boolean {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing FlightModeProperty: ${data.byteLength}`)
    }

    return data.getUint8(0) === FLIGHT_MODE_ON
  }

  protected async preWrite (value: boolean): Promise<void> {
    await this.command.writeValue(COMMAND_SET_FLIGHT_MODE)
  }

  protected encodeData (value: boolean): Uint8Array {
    const status = value ? FLIGHT_MODE_ON : 0
    return new Uint8Array([status])
  }
}
