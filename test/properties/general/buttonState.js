/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { ButtonStateProperty } = require('../../../dist-test/properties/general/buttonState')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.BUTTON_STATE]

describe('buttonState', () => {
  it('gets correct data from readValue', async () => {
    const prop = new ButtonStateProperty(initMock(CH, new Uint8Array([0, 1])))
    return expect(prop.readValue()).resolves.toEqual({
      powerButtonState: false,
      modeButtonState: true
    })
  })

  it('fails on invalid data', async () => {
    const prop = new ButtonStateProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
