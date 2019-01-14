import { ReadOnlyProperty } from '../property'
import { Toothbrush } from '../../toothbrush'
import { SERVICES, CHARACTERISTICS } from '../../constants'
import { CommandProperty } from './command'
import { BrushingMode, Session } from '../../types'
import { dateFromTimestamp } from '../../util'

const SERVICE = SERVICES.CONFIGURATION
const CHARACTERISTIC = CHARACTERISTICS.DATA

const COMMAND_ID_GET_DATA: number = 0x02

export class DataProperty implements ReadOnlyProperty {
  private characteristic: Promise<BluetoothRemoteGATTCharacteristic | null>
  private command: CommandProperty

  constructor (toothbrush: Toothbrush) {
    this.characteristic = toothbrush.getCharacteristic(SERVICE, CHARACTERISTIC)
    this.command = new CommandProperty(toothbrush)
  }

  public async readValue (): Promise<Session[]> {
    const result: Session[] = []
    for (let i = 0; i < 30; i++) {
      const res = await this.readValueByIndex(i)
      if (res === null) {
        break
      }
      result[i] = res
    }
    return result
  }

  public async isAvailable (): Promise<boolean> {
    return !!(await this.characteristic)
  }

  private async readValueByIndex (index: number): Promise<Session | null> {
    const characteristic = await this.characteristic
    if (!characteristic) {
      throw new Error('The property is not available on this device.')
    }
    await this.command.writeValue([COMMAND_ID_GET_DATA, index])
    const data = await characteristic.readValue()
    return this.parseData(data)
  }

  private parseData (data: DataView): Session | null {
    if (data.byteLength !== 16) {
      throw new Error(`Invalid length when parsing DataProperty: ${data.byteLength}`)
    }
    const data32bit = new Uint32Array(data.buffer)
    const data16bit = new Uint16Array(data.buffer)
    const data8bit = new Uint8Array(data.buffer)
    const timestamp = data32bit[0]
    if (timestamp === 0) {
      return null
    }
    const result: Session = {
      timestamp,
      startTime: dateFromTimestamp(timestamp),
      duration: data16bit[2],
      eventCount: data8bit[6],
      mode: data8bit[7] as BrushingMode,
      timeUnderPressure: data16bit[4],
      pressureWarnings: data8bit[10],
      finalBatteryState: data8bit[11]
    }
    const lastSegment = data32bit[3]
    if (lastSegment > 0x1000000) {
      result.lastFullCharge = dateFromTimestamp(lastSegment)
    } else {
      result.totalTargetTime = data16bit[6] & 0x1fff
      result.sector = data16bit[6] >> 13
      result.sessionID = data16bit[7] & 0x1fff
      result.userID = data16bit[7] >> 13
    }
    return result
  }
}
