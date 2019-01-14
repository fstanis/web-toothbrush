import { SimpleNotifyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { BrushingMode } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.BRUSHING_MODE

export class BrushingModeProperty extends SimpleNotifyProperty<BrushingMode> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): BrushingMode {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing BrushingModeProperty: ${data.byteLength}`)
    }

    const result = data.getUint8(0)
    if (!BrushingMode[result]) {
      return BrushingMode.Unknown
    }
    return result
  }
}
