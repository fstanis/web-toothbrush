import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { CommandProperty } from './command'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.TONGUE_TIME

const COMMAND_SET_TONGUE_TIME: [number, number] = [0x37, 0x2B]

export class TongueTimeProperty extends SimpleProperty<number> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected decodeData (data: DataView): number {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing TongueTimeProperty: ${data.byteLength}`)
    }

    return data.getUint8(0)
  }

  protected async preWrite (value: number): Promise<void> {
    await this.command.writeValue(COMMAND_SET_TONGUE_TIME)
  }

  protected encodeData (value: number): Uint8Array {
    return new Uint8Array([value])
  }
}
