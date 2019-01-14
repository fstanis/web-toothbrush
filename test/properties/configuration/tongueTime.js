/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { TongueTimeProperty } = require('../../../dist-test/properties/configuration/tongueTime')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.TONGUE_TIME]

describe('tongueTime', () => {
  it('gets correct data from readValue', async () => {
    const prop = new TongueTimeProperty(initMock(CH, new Uint8Array([20])))
    return expect(prop.readValue()).resolves.toEqual(20)
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new TongueTimeProperty(mock)
    await prop.writeValue(30)
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x2B]))
    return expect(mock.written).toEqual(new Uint8Array([30]))
  })

  it('matches readValue with writeValue', async () => {
    const data = 5
    const mock = initMock(CH)
    const prop = new TongueTimeProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
