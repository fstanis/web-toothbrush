import { SimpleProperty } from '../simpleProperty'
import { Toothbrush } from '../../toothbrush'
import { CommandProperty } from './command'
import { SERVICES, CHARACTERISTICS } from '../../constants'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.QUADRANT_TIMES

const COMMAND_SET_QUADRANT_TIMES: [number, number] = [0x37, 0x2A]

export class QuadrantTimesProperty extends SimpleProperty<number[]> {
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    super(toothbrush, SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  protected decodeData (data: DataView): number[] {
    if (data.byteLength !== 16) {
      throw new Error(`Invalid length when parsing QuadrantTimesProperty: ${data.byteLength}`)
    }

    const dataArray = new Uint16Array(data.buffer)
    const result: number[] = []
    for (let i = 0; i < dataArray.length; i++) {
      const time = dataArray[i]
      if (time === 0) {
        break
      }
      result.push(time)
    }
    return result
  }

  protected async preWrite (value: number[]): Promise<void> {
    await this.command.writeValue(COMMAND_SET_QUADRANT_TIMES)
  }

  protected encodeData (value: number[]): Uint16Array {
    const times = value.slice()
    times.length = 8
    return new Uint16Array(times)
  }
}
