/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { ColorProperty } = require('../../../dist-test/properties/configuration/color')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.COLOR]

describe('color', () => {
  it('gets correct data from readValue', async () => {
    const prop = new ColorProperty(initMock(CH, new Uint8Array([10, 20, 30, 0])))
    return expect(prop.readValue()).resolves.toEqual({
      red: 10,
      green: 20,
      blue: 30,
      identifier: 0
    })
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new ColorProperty(mock)
    await prop.writeValue({
      red: 12,
      green: 22,
      blue: 32,
      identifier: 0
    })
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x2F]))
    return expect(mock.written).toEqual(new Uint8Array([12, 22, 32, 0]))
  })

  it('writes correct data with writeValue (demo mode)', async () => {
    const mock = initMock(CH)
    const prop = new ColorProperty(mock)
    await prop.writeValue({
      red: 12,
      green: 22,
      blue: 32,
      identifier: 0x80
    })
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x5E]))
    return expect(mock.written).toEqual(new Uint8Array([12, 22, 32, 128]))
  })

  it('matches readValue with writeValue', async () => {
    const data = {
      red: 51,
      green: 52,
      blue: 53,
      identifier: 1
    }
    const mock = initMock(CH)
    const prop = new ColorProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
