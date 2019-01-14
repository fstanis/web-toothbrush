/* global describe it */
const expect = require('expect')
const { initMock } = require('../../mock')
const { UserAccountIdProperty } = require('../../../dist-test/properties/general/userAccountId')
const { SERVICES, CHARACTERISTICS } = require('../../../dist-test/constants')

const CH = [SERVICES.GENERAL, CHARACTERISTICS.USER_ACCOUNT_ID]

describe('userAccountId', () => {
  it('gets correct data from readValue', async () => {
    const mock = initMock(CH, new Uint8Array([22]))
    const prop = new UserAccountIdProperty(mock)
    return expect(prop.readValue()).resolves.toEqual(22)
  })

  it('writes correct data with writeValue', async () => {
    const mock = initMock(CH)
    const prop = new UserAccountIdProperty(mock)
    await prop.writeValue(52)
    return expect(mock.written).toEqual(new Uint8Array([52]))
  })

  it('matches readValue with writeValue', async () => {
    const data = 8
    const mock = initMock(CH)
    const prop = new UserAccountIdProperty(mock)
    await prop.writeValue(data)
    mock.setValue(mock.written)
    return expect(prop.readValue()).resolves.toEqual(data)
  })
})
