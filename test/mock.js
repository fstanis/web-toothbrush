const { SERVICES, CHARACTERISTICS } = require('../dist-test/constants')

class MockToothbrush {
  constructor (serviceId, characteristicId, value) {
    this.serviceId = serviceId
    this.characteristicId = characteristicId
    this.setValue(value)
    this.mock = {
      readValue: async () => this.value,
      writeValue: async (value) => {
        this.written = new Uint8Array(value.buffer)
      }
    }
    this.commandMock = {
      writeValue: async (value) => {
        this.command = value
      }
    }
  }

  async getCharacteristic (serviceId, id) {
    if (serviceId === SERVICES.CONFIGURATION && id === CHARACTERISTICS.COMMAND) {
      return this.commandMock
    }
    if (serviceId !== this.serviceId || id !== this.characteristicId) {
      throw new Error(`Wrong service or characteristic requested: ${serviceId}, ${id}`)
    }
    return this.mock
  }

  setValue (value) {
    if (value) {
      this.value = new DataView(value.buffer)
    }
  }
}

function initMock ([service, characteristic], value) {
  return new MockToothbrush(service, characteristic, value)
}

module.exports = { initMock }
