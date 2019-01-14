import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { CommandProperty } from './command'
import { BrushingTimer } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.BRUSHING_TIMER

const COMMAND_SET_BRUSHING_TIMER: [number, number] = [0x37, 0x28]

export class BrushingTimerProperty extends SimpleProperty<BrushingTimer> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected decodeData (data: DataView): BrushingTimer {
    if (data.byteLength !== 1) {
      throw new Error(`Invalid length when parsing BrushingTimerProperty: ${data.byteLength}`)
    }

    const state = data.getUint8(0)
    return {
      vibrate: (state & 1) === 1,
      finalVibrateOnly: (state & 2) === 2,
      visualSignal: (state & 4) === 4,
      finalVisualSignalOnly: (state & 8) === 8
    }
  }

  protected async preWrite (value: BrushingTimer): Promise<void> {
    await this.command.writeValue(COMMAND_SET_BRUSHING_TIMER)
  }

  protected encodeData (value: BrushingTimer): Uint8Array {
    let state = 0
    if (value.vibrate) {
      state |= 1
    }
    if (value.finalVibrateOnly) {
      state |= 2
    }
    if (value.visualSignal) {
      state |= 4
    }
    if (value.finalVisualSignalOnly) {
      state |= 8
    }
    return new Uint8Array([state])
  }
}
