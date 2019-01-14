/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { DeviceTypeProperty } = require('../../../dist-test/properties/general/deviceType')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.DEVICE_TYPE]

describe('deviceType', () => {
  it('gets correct data from readValue', async () => {
    const prop = new DeviceTypeProperty(initMock(CH, new Uint8Array([1, 2, 3])))
    return expect(prop.readValue()).resolves.toEqual({
      modelId: 1,
      protocolVersion: 2,
      firmwareVersion: 3
    })
  })

  it('gets correct data from readValue (short message)', async () => {
    const prop = new DeviceTypeProperty(initMock(CH, new Uint8Array([2])))
    return expect(prop.readValue()).resolves.toEqual({
      modelId: 2
    })
  })

  it('fails on invalid data', async () => {
    const prop = new DeviceTypeProperty(initMock(CH, new Uint8Array([0, 0])))
    return expect(prop.readValue()).rejects.toThrow()
  })
})
