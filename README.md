# web-toothbrush

*Yet another IoT JS library nobody asked for*

## Overview

**This library is unofficial and I'm in no way associated with the manufacturers
of these devices. Use at your own risk.**

This is a simple JavaScript library that uses the [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
to connect a smart electric toothbrush that supports bluetooth.

Depending on the model allows you to read the current status during a session,
modify settings or read data from previous sessions.

## Usage

1.  Install using NPM.

```
npm i web-toothbrush
```

2.  Import the `Toothbrush` class.

```js
import { Toothbrush } from 'web-toothbrush'
```

3.  Connect to your device and receive a [`BluetoothRemoteGATTServer`](https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTServer) object.

```js
// This displays a dialog to the user
const device = await navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: Toothbrush.services // contains list of GATT services used
})

// Connect to the GATT server
const server = await device.gatt.connect()
```

4.  Make an instance of `Toothbrush`.

```js
const toothbrush = new Toothbrush(server)
```

5.  Query some properties.

```js
const batteryLife = toothbrush.getProperty('batteryLevel')
if (!await batteryLife.isAvailable()) {
  // tough luck, we can't query that property
}
console.log(await batteryLife.readValue())
```

### Simple version

In most cases, you can just use `Toothbrush.connect()` if you don't want to worry about all the bluetooth connection trouble:

```js
import { Toothbrush } from 'web-toothbrush'

[...]

const toothbrush = await Toothbrush.connect()
const batteryLife = toothbrush.getProperty('batteryLevel')
[...]
```

## Supported properties

The following properties can be accessed via the bluetooth API. Availability
depends on the model of your device.

### General information

All of these properties are read-only.

*   `handleId` - the unique ID of the device
*   `deviceType` - the type of the device
*   `userAccountId` - ID of user account
*   `batteryLevel` - current battery percent
*   `data` - information about previous saved sessions

### Current session

These properties are read only, but can be subscribed to and reflect the status
of the current session in progress.

*   `brushingTime` - how long the toothbrush has been on
*   `buttonState` - whether a button is pressed and which
*   `mode` - current brushing mode
*   `pressureSensor` - whether a pressure sensor is currently triggered
*   `quadrantProperty` - the quadrant currently in progress
*   `smiley` - current "smiley" state
*   `state` - current toothbrush state

### Configuration

These properties can be read or modified to affect the toothbrush behavior.

*   `brushingModes` - modes that can be triggered and used
*   `brushingTimer` - how the user is notified about the timer state
*   `color` - color of the LEDs
*   `command` - used internally by other properties to send commands
*   `flightMode` - used to enable or disable flight mode
*   `pressure` - how the user if notified about the pressure sensor
*   `quadrantTimes` - how much time is spent per quadrant
*   `rtc` - current time
*   `timezone` - current time zone / locale
*   `tongueTime` - how much time is spent in tongue cleaning mode

## Supported devices

The following toothbrushes are currently supported by this library:

*   Oral-B Genius 9000
*   Oral-B Genius 8000
*   Oral-B Teen
*   Oral-B SmartSeries 6500
*   Oral-B Smart 5 5000N

Please refer to [Web Bluetooth Community Group's Implementation Status](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)
to see which platforms currently support the (experimental) Web Bluetooth API.
