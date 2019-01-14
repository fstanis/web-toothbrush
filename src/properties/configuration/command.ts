import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.COMMAND

const COMMAND_PING: [number, number] = [0x0A, 0x00]

export class CommandProperty extends SimpleProperty<[number, number]> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): [number, number] {
    if (data.byteLength !== 2) {
      throw new Error(`Invalid length when parsing CommandProperty: ${data.byteLength}`)
    }

    const dataArray = new Uint8Array(data.buffer)
    return [dataArray[0], dataArray[1]]
  }

  protected encodeData (value: [number, number]): Uint8Array {
    return new Uint8Array(value)
  }

  public async sendPing () {
    await this.writeValue(COMMAND_PING)
  }
}
