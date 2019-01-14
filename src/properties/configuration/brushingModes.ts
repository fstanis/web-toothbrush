import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { CommandProperty } from './command'
import { BrushingMode } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.BRUSHING_MODES

const COMMAND_SET_RTC: [number, number] = [0x37, 0x29]

export class BrushingModesProperty extends SimpleProperty<BrushingMode[]> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected decodeData (data: DataView): BrushingMode[] {
    const dataArray = new Uint8Array(data.buffer)

    const result: BrushingMode[] = []
    for (let i = 0; i < dataArray.length; i++) {
      const mode = dataArray[i]
      if (mode === 0 || mode === -1) {
        break
      }
      result.push(mode)
    }
    return result
  }

  protected async preWrite (value: BrushingMode[]): Promise<void> {
    await this.command.writeValue(COMMAND_SET_RTC)
  }

  protected encodeData (value: BrushingMode[]): Uint8Array {
    const modes = value.slice()
    modes.length = 8
    return new Uint8Array(modes)
  }
}
