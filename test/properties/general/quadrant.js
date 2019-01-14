/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { QuadrantProperty } = require('../../../dist-test/properties/general/quadrant')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.QUADRANT]

describe('quadrant', () => {
  it('gets correct data from readValue', async () => {
    const prop = new QuadrantProperty(initMock(CH, new Uint8Array([2])))
    return expect(prop.readValue()).resolves.toEqual(2)
  })

  it('fails on invalid data', async () => {
    const prop = new QuadrantProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
