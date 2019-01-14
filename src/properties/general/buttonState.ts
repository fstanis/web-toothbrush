import { SimpleNotifyProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { ButtonState } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.GENERAL
const CHARACTERISTIC = CHARACTERISTICS.BUTTON_STATE

export class ButtonStateProperty extends SimpleNotifyProperty<ButtonState> {
  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
  }

  protected decodeData (data: DataView): ButtonState {
    if (data.byteLength !== 2 && data.byteLength !== 4) {
      throw new Error(`Invalid length when parsing ButtonStateProperty: ${data.byteLength}`)
    }

    const dataArray = new Uint8Array(data.buffer)
    return {
      powerButtonState: dataArray[0] === 1,
      modeButtonState: dataArray[1] === 1
    }
  }
}
