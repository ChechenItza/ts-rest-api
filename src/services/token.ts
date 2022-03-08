import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { TokenPair } from '../models/token.js'
import { JWT_SECRET, ACCES_EXP, REFRESH_EXP } from '../utils/config.js'

export interface ITokenRepo {
  create(uuid: string, userId: number, exp: number): Promise<void>
  find(uuid: string): Promise<number>
  remove(uuid: string): Promise<number>
}

export default class TokenService {
  constructor(
    protected tokenRepo: ITokenRepo
  ) {}

  async genTokenPair(userId: number): Promise<TokenPair> {
    const accessToken = await this.genToken(userId, ACCES_EXP)
    const refreshToken = await this.genToken(userId, REFRESH_EXP)
    
    return new TokenPair(accessToken, refreshToken)
  }

  private async genToken(userId: number, exp: number): Promise<string> {
    const uuid = uuidv4()
    const token = jwt.sign({ //TODO: change to async version
      exp: Math.floor(Date.now() / 1000) + exp,
      uuid
    }, JWT_SECRET)
    await this.tokenRepo.create(uuid, userId, exp)

    return token
  }

  async refresh(uuid: string): Promise<TokenPair> {
    const userId = await this.tokenRepo.remove(uuid) //TODO: Maybe return boolean from tokenRepo and throw error here instead?

    return this.genTokenPair(userId)
  }

  async getUserId(uuid: string): Promise<number> {
    return this.tokenRepo.find(uuid) //TODO: Maybe return boolean from tokenRepo and throw error here instead?
  }
}
