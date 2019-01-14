/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { QuadrantTimesProperty } = require('../../../dist-test/properties/configuration/quadrantTimes')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.QUADRANT_TIMES]

describe('quadrantTimes', () => {
  it('gets correct data from readValue', async () => {
    const prop = new QuadrantTimesProperty(initMock(CH, new Uint16Array([10, 20, 30, 0, 0, 0, 0, 0])))
    return expect(prop.readValue()).resolves.toEqual([10, 20, 30])
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new QuadrantTimesProperty(mock)
    await prop.writeValue([
      11,
      12
    ])
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x2A]))
    return expect(mock.written).toEqual(new Uint8Array([11, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
  })

  it('matches readValue with writeValue', async () => {
    const data = [
      21,
      22,
      3
    ]
    const mock = initMock(CH)
    const prop = new QuadrantTimesProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
