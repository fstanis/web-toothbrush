/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { BrushingTimeProperty } = require('../../../dist-test/properties/general/brushingTime')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.BRUSHING_TIME]

describe('brushingTime', () => {
  it('gets correct data from readValue', async () => {
    const prop = new BrushingTimeProperty(initMock(CH, new Uint8Array([1, 2])))
    return expect(prop.readValue()).resolves.toEqual(62)
  })

  it('fails on invalid data', async () => {
    const prop = new BrushingTimeProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
