import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { dateFromTimestamp, timestampFromDate } from '../../util'
import { CommandProperty } from './command'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.RTC

const COMMAND_GET_RTC: [number, number] = [0x01, 0x00]
const COMMAND_SET_RTC: [number, number] = [0x37, 0x26]

export class RtcProperty extends SimpleProperty<Date> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected async preRead (): Promise<void> {
    await this.command.writeValue(COMMAND_GET_RTC)
  }

  protected decodeData (data: DataView): Date {
    if (data.byteLength !== 4) {
      throw new Error(`Invalid length when parsing RtcProperty: ${data.byteLength}`)
    }

    return dateFromTimestamp(data.getUint32(0, true))
  }

  protected async preWrite (): Promise<void> {
    await this.command.writeValue(COMMAND_SET_RTC)
  }

  protected encodeData (value: Date): Uint32Array {
    return new Uint32Array([timestampFromDate(value)])
  }
}
