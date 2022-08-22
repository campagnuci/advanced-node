const THIRTY_MINUTES_IN_MILLISECONDS = 1800000

export class AccessToken {
  constructor (readonly value: string) {}

  static get expirationInMs (): number {
    return THIRTY_MINUTES_IN_MILLISECONDS
  }
}
