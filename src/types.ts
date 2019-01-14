export interface BrushingTimer {
  vibrate: boolean
  finalVibrateOnly: boolean
  visualSignal: boolean
  finalVisualSignalOnly: boolean
}

export interface Color {
  red: number,
  green: number,
  blue: number,
  identifier: number
}

export interface Session {
  timestamp: number,
  startTime: Date,
  duration: number,
  eventCount: number,
  mode: BrushingMode,
  timeUnderPressure: number,
  pressureWarnings: number,
  finalBatteryState: number,
  lastFullCharge?: Date,
  totalTargetTime?: number,
  sector?: number,
  sessionID?: number,
  userID?: number
}

export enum BrushingMode {
  Off = 0x00,
  DailyClean = 0x01,
  Sensitive = 0x02,
  Massage = 0x03,
  Whitening = 0x04,
  DeepClean = 0x05,
  TongueCleaning = 0x06,
  Turbo = 0x07,
  Unknown = 0xff
}

export interface ButtonState {
  powerButtonState: boolean
  modeButtonState: boolean
}

export enum DeviceState {
  Unknown = 0x00,
  Init = 0x01,
  Idle = 0x02,
  Run = 0x03,
  Charge = 0x04,
  Setup = 0x05,
  FlightMenu = 0x06,
  ChangeForbidden = 0x07,
  PreRun = 0x08,
  FinalTest = 0x71,
  PcbTest = 0x72,
  Sleep = 0x73,
  Transport = 0x74,
  CalibrationTest = 0x75
}

export interface DeviceStateFull {
  deviceState: DeviceState
  transportMode: boolean
  deactivateTimer: boolean
}

export interface DeviceType {
  modelId: number
  protocolVersion?: number
  firmwareVersion?: number
}

export interface PressureConfig {
  pressureSignalOn: boolean
  motorSpeedReduced: boolean
}

export interface PressureSensorStatus {
  highPressure: boolean
  motorSpeedReduced: boolean
}
