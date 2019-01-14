/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { PressureProperty } = require('../../../dist-test/properties/configuration/pressure')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.PRESSURE]

describe('pressure', () => {
  it('gets correct data from readValue', async () => {
    const prop = new PressureProperty(initMock(CH, new Uint8Array([1])))
    return expect(prop.readValue()).resolves.toEqual({
      pressureSignalOn: true,
      motorSpeedReduced: false
    })
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new PressureProperty(mock)
    await prop.writeValue({
      pressureSignalOn: true,
      motorSpeedReduced: true
    })
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x2C]))
    return expect(mock.written).toEqual(new Uint8Array([3]))
  })

  it('matches readValue with writeValue', async () => {
    const data = {
      pressureSignalOn: false,
      motorSpeedReduced: true
    }
    const mock = initMock(CH)
    const prop = new PressureProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
