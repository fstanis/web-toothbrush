const BASE_TIMESTAMP = 946684800000

export function dateFromTimestamp (timestamp: number): Date {
  return new Date(BASE_TIMESTAMP + timestamp * 1000)
}

export function timestampFromDate (date: Date) {
  return Math.round((date.getTime() - BASE_TIMESTAMP) / 1000)
}
