/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { RtcProperty } = require('../../../dist-test/properties/configuration/rtc')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.RTC]

describe('rtc', () => {
  it('gets correct data from readValue', async () => {
    const mock = initMock(CH, new Uint32Array([318395045]))
    const prop = new RtcProperty(mock)
    expect(await prop.readValue()).toEqual(new Date(2010, 1, 2, 3, 4, 5))
    return expect(mock.command).toEqual(new Uint8Array([0x01, 0x00]))
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new RtcProperty(mock)
    await prop.writeValue(new Date(2015, 1, 2, 12, 4, 5))
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x26]))
    const result = new Uint32Array([476193845])
    return expect(mock.written).toEqual(new Uint8Array(result.buffer))
  })

  it('matches readValue with writeValue', async () => {
    const data = new Date(Math.round(Date.now() / 1000) * 1000)
    const mock = initMock(CH)
    const prop = new RtcProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
