/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { BrushingMode } = require('../../../dist-test/types')
const { BrushingModesProperty } = require('../../../dist-test/properties/configuration/brushingModes')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.BRUSHING_MODES]

describe('brushingModes', () => {
  it('gets correct data from readValue', async () => {
    const prop = new BrushingModesProperty(initMock(CH, new Uint8Array([1, 2, 3, 0, 0])))
    return expect(prop.readValue()).resolves.toEqual([
      BrushingMode.DailyClean,
      BrushingMode.Sensitive,
      BrushingMode.Massage
    ])
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH, new Uint8Array([1, 2, 3, 0, 0]))
    const prop = new BrushingModesProperty(mock)
    await prop.writeValue([
      BrushingMode.DailyClean,
      BrushingMode.Massage
    ])
    return expect(mock.written).toEqual(new Uint8Array([1, 3, 0, 0, 0, 0, 0, 0]))
  })

  it('matches readValue with writeValue', async () => {
    const data = [
      BrushingMode.DailyClean,
      BrushingMode.Massage
    ]
    const mock = initMock(CH)
    const prop = new BrushingModesProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
