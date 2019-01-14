/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { FlightModeProperty } = require('../../../dist-test/properties/configuration/flightMode')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.FLIGHT_MODE]

describe('flightMode', () => {
  it('gets correct data from readValue', async () => {
    const prop = new FlightModeProperty(initMock(CH, new Uint8Array([0x47])))
    return expect(prop.readValue()).resolves.toEqual(true)
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new FlightModeProperty(mock)
    await prop.writeValue(false)
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x2E]))
    return expect(mock.written).toEqual(new Uint8Array([0]))
  })

  it('matches readValue with writeValue', async () => {
    const data = true
    const mock = initMock(CH)
    const prop = new FlightModeProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
