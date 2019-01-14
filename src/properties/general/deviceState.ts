import { SimpleNotifyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { DeviceState, DeviceStateFull } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.DEVICE_STATE

export class DeviceStateProperty extends SimpleNotifyProperty<DeviceStateFull> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): DeviceStateFull {
    if (data.byteLength !== 2) {
      throw new Error(`Invalid length when parsing DeviceStateProperty: ${data.byteLength}`)
    }

    const dataArray = new Uint8Array(data.buffer)
    let state = dataArray[0]
    if (!DeviceState[state]) {
      state = DeviceState.Unknown
    }
    return {
      deviceState: state,
      transportMode: (dataArray[1] & 1) === 1,
      deactivateTimer: (dataArray[1] & 2) === 2
    }
  }
}
