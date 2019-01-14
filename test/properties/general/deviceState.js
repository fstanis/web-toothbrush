/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { DeviceState } = require('../../../dist-test/types')
const { DeviceStateProperty } = require('../../../dist-test/properties/general/deviceState')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.DEVICE_STATE]

describe('deviceState', () => {
  it('gets correct data from readValue', async () => {
    const prop = new DeviceStateProperty(initMock(CH, new Uint8Array([2, 3])))
    return expect(prop.readValue()).resolves.toEqual({
      deviceState: DeviceState.Idle,
      transportMode: true,
      deactivateTimer: true
    })
  })

  it('fails on invalid data', async () => {
    const prop = new DeviceStateProperty(initMock(CH, new Uint8Array([0, 0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
