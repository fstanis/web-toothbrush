import { SimpleNotifyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.SMILEY

export class SmileyProperty extends SimpleNotifyProperty<number> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): number {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing SmileyProperty: ${data.byteLength}`)
    }

    return data.getUint8(0)
  }
}
