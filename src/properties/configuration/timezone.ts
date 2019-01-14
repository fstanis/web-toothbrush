import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.TIMEZONE

export class TimezoneProperty extends SimpleProperty<number> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): number {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing TimezoneProperty: ${data.byteLength}`)
    }

    return data.getUint8(0)
  }

  protected encodeData (value: number): Uint8Array {
    return new Uint8Array([value])
  }
}
