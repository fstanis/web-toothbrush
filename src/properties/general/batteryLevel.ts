import { SimpleNotifyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.BATTERY_LEVEL

export class BatteryLevelProperty extends SimpleNotifyProperty<number> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): number {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing BatteryLevelProperty: ${data.byteLength}`)
    }

    return data.getUint8(0)
  }
}
