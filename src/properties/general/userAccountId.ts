import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.USER_ACCOUNT_ID

export class UserAccountIdProperty extends SimpleProperty<number> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): number {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing UserAccountIdProperty: ${data.byteLength}`)
    }

    return data.getUint8(0)
  }

  protected encodeData (value: number): Uint8Array {
    return new Uint8Array([value])
  }
}
