/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { PressureSensorProperty } = require('../../../dist-test/properties/general/pressureSensor')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.PRESSURE_SENSOR]

describe('pressureSensor', () => {
  it('gets correct data from readValue', async () => {
    const prop = new PressureSensorProperty(initMock(CH, new Uint8Array([0x80])))
    return expect(prop.readValue()).resolves.toEqual({
      highPressure: true,
      motorSpeedReduced: false
    })
  })

  it('fails on invalid data', async () => {
    const prop = new PressureSensorProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
