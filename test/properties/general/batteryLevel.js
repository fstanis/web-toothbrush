/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { BatteryLevelProperty } = require('../../../dist-test/properties/general/batteryLevel')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.BATTERY_LEVEL]

describe('batteryLevel', () => {
  it('gets correct data from readValue', async () => {
    const prop = new BatteryLevelProperty(initMock(CH, new Uint8Array([50])))
    return expect(prop.readValue()).resolves.toEqual(50)
  })

  it('fails on invalid data', async () => {
    const prop = new BatteryLevelProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
