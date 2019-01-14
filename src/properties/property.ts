export interface ReadOnlyProperty {
  readValue (): Promise<any>
  isAvailable (): Promise<boolean>
}

export interface WritableProperty extends ReadOnlyProperty {
  writeValue (value: any): Promise<void>
}

export interface NotifyProperty extends ReadOnlyProperty {
  addValueListener (listener: (value: any) => void): void
  startNotifications (): Promise<void>
  stopNotifications (): Promise<void>
}

export type Property = ReadOnlyProperty | WritableProperty | NotifyProperty
