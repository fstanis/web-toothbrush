/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { TimezoneProperty } = require('../../../dist-test/properties/configuration/timezone')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.TIMEZONE]

describe('timezone', () => {
  it('gets correct data from readValue', async () => {
    const mock = initMock(CH, new Uint8Array([12]))
    const prop = new TimezoneProperty(mock)
    return expect(prop.readValue()).resolves.toEqual(12)
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new TimezoneProperty(mock)
    await prop.writeValue(42)
    return expect(mock.written).toEqual(new Uint8Array([42]))
  })

  it('matches readValue with writeValue', async () => {
    const data = 123
    const mock = initMock(CH)
    const prop = new TimezoneProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
