/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { BrushingTimerProperty } = require('../../../dist-test/properties/configuration/brushingTimer')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.CONFIGURATION, CHARACTERISTICS.BRUSHING_TIMER]

describe('brushingTimer', () => {
  it('gets correct data from readValue', async () => {
    const prop = new BrushingTimerProperty(initMock(CH, new Uint8Array([15])))
    return expect(prop.readValue()).resolves.toEqual({
      vibrate: true,
      finalVibrateOnly: true,
      visualSignal: true,
      finalVisualSignalOnly: true
    })
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new BrushingTimerProperty(mock)
    await prop.writeValue({
      vibrate: true,
      finalVibrateOnly: false,
      visualSignal: true,
      finalVisualSignalOnly: false
    })
    expect(mock.command).toEqual(new Uint8Array([0x37, 0x28]))
    return expect(mock.written).toEqual(new Uint8Array([5]))
  })

  it('matches readValue with writeValue', async () => {
    const data = {
      vibrate: true,
      finalVibrateOnly: false,
      visualSignal: true,
      finalVisualSignalOnly: false
    }
    const mock = initMock(CH)
    const prop = new BrushingTimerProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
