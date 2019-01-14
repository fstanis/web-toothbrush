/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { SmileyProperty } = require('../../../dist-test/properties/general/smiley')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.SMILEY]

describe('smiley', () => {
  it('gets correct data from readValue', async () => {
    const prop = new SmileyProperty(initMock(CH, new Uint8Array([1])))
    return expect(prop.readValue()).resolves.toEqual(1)
  })

  it('fails on invalid data', async () => {
    const prop = new SmileyProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
