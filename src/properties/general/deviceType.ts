import { SimpleReadOnlyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { DeviceType } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.DEVICE_TYPE

export class DeviceTypeProperty extends SimpleReadOnlyProperty<DeviceType> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): DeviceType {
    if (data.byteLength !== 1 && data.byteLength !== 3) {
      throw new Error(`Invalid length when parsing DeviceTypeProperty: ${data.byteLength}`)
    }

    const dataArray = new Uint8Array(data.buffer)
    if (dataArray.length === 3) {
      return {
        modelId: dataArray[0],
        protocolVersion: dataArray[1],
        firmwareVersion: dataArray[2]
      }
    }
    return {
      modelId: dataArray[0]
    }
  }
}
