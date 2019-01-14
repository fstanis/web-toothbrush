import { SimpleReadOnlyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.HANDLE_ID

export class HandleIdProperty extends SimpleReadOnlyProperty<number> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): number {
    if (data.byteLength !== 4) {
      throw new Error(`Invalid length when parsing HandleIdProperty: ${data.byteLength}`)
    }

    return data.getUint32(0, true)
  }
}
