export class TokenPair {
  constructor(
    public accessToken: string,
    public refreshToken: string
  ) {}

  toJSON() {
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken
    }
  }
}

export interface TokenPayload {
  uuid: string
}