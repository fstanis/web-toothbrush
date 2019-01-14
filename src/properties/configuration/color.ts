import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { CommandProperty } from './command'
import { Color } from '../../types'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.COLOR

const COMMAND_SET_COLOR: [number, number] = [0x37, 0x2F]
const COMMAND_SET_COLOR_DEMO: [number, number] = [0x37, 0x5E]

export class ColorProperty extends SimpleProperty<Color> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected decodeData (data: DataView): Color {
    if (data.byteLength !== 4) {
      throw new Error(`Invalid length when parsing ColorProperty: ${data.byteLength}`)
    }

    const dataArray = new Uint8Array(data.buffer)
    return {
      red: dataArray[0],
      green: dataArray[1],
      blue: dataArray[2],
      identifier: dataArray[3]
    }
  }

  protected async preWrite (value: Color): Promise<void> {
    if (value.identifier === 0x80 || value.identifier === 0x81) {
      await this.command.writeValue(COMMAND_SET_COLOR_DEMO)
    } else {
      await this.command.writeValue(COMMAND_SET_COLOR)
    }
  }

  protected encodeData (value: Color): Uint8Array {
    return new Uint8Array([value.red, value.green, value.blue, value.identifier])
  }
}
