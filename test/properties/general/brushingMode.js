/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { BrushingMode } = require('../../../dist-test/types')
const { BrushingModeProperty } = require('../../../dist-test/properties/general/brushingMode')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.BRUSHING_MODE]

describe('brushingMode', () => {
  it('gets correct data from readValue', async () => {
    const prop = new BrushingModeProperty(initMock(CH, new Uint8Array([1])))
    return expect(prop.readValue()).resolves.toEqual(BrushingMode.DailyClean)
  })

  it('returns unknown enum', async () => {
    const prop = new BrushingModeProperty(initMock(CH, new Uint8Array([123])))
    return expect(prop.readValue()).resolves.toEqual(BrushingMode.Unknown)
  })

  it('fails on invalid data', async () => {
    const prop = new BrushingModeProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
