/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { HandleIdProperty } = require('../../../dist-test/properties/general/handleId')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.HANDLE_ID]

describe('handleId', () => {
  it('gets correct data from readValue', async () => {
    const prop = new HandleIdProperty(initMock(CH, new Uint32Array([123])))
    return expect(prop.readValue()).resolves.toEqual(123)
  })

  it('fails on invalid data', async () => {
    const prop = new HandleIdProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
