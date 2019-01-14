/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { DataProperty } = require('../../../dist-test/properties/configuration/data')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.DATA]

describe('data', () => {
  it('gets correct data from readValue', async () => {
    const item = {
      duration: 1,
      eventCount: 1,
      finalBatteryState: 0,
      mode: 1,
      pressureWarnings: 0,
      sector: 4,
      sessionID: 4,
      startTime: new Date('2018-12-29T16:40:40.000Z'),
      timeUnderPressure: 0,
      timestamp: 599416840,
      totalTargetTime: 120,
      userID: 0
    }
    const mock = initMock(CH)
    mock.mock.readValue = async () => {
      if (mock.command[1] !== 0) {
        return new Uint8Array(16)
      }
      return new Uint8Array([8, 96, 186, 35, 1, 0, 1, 1, 0, 0, 0, 0, 120, 128, 4, 0])
    }
    const prop = new DataProperty(mock)
    return expect(prop.readValue()).resolves.toEqual([item])
  })

  it('fails on invalid data', async () => {
    const prop = new DataProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
