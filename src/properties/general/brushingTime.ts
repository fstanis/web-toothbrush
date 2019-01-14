import { SimpleNotifyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.BRUSHING_TIME

export class BrushingTimeProperty extends SimpleNotifyProperty<number> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): number {
    if (data.byteLength !== 2) {
      throw new Error(`Invalid length when parsing BrushingTimeProperty: ${data.byteLength}`)
    }

    const dataArray = new Uint8Array(data.buffer)
    return dataArray[0] * 60 + dataArray[1]
  }
}
