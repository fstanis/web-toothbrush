import { SimpleNotifyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { PressureSensorStatus } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.PRESSURE_SENSOR

export class PressureSensorProperty extends SimpleNotifyProperty<PressureSensorStatus> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): PressureSensorStatus {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing PressureSensorProperty: ${data.byteLength}`)
    }

    const status = data.getUint8(0)
    return {
      highPressure: (status & 0x80) === 0x80,
      motorSpeedReduced: (status & 0x40) === 0x40
    }
  }
}
