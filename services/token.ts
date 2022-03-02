import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { TokenPair } from '../models/token.js'
import { JWT_SECRET } from '../utils/config.js'

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
    let accessExp = 60 * 60 * 2       //2 hours
    let accessToken = await this.genToken(userId, accessExp)

    let refreshExp = 60 * 60 * 24 * 7 //7 days
    let refreshToken = await this.genToken(userId, refreshExp)
    
    return new TokenPair(accessToken, refreshToken)
  }

  async genToken(userId: number, exp: number): Promise<string> {
    let uuid = uuidv4()
    let token = jwt.sign({ //TODO: change to async version
      exp: Math.floor(Date.now() / 1000) + exp,
      uuid
    }, JWT_SECRET)
    await this.tokenRepo.create(uuid, userId, exp)

    return token
  }

  async refresh(uuid: string): Promise<TokenPair> {
    let userId = await this.tokenRepo.remove(uuid) //TODO: Maybe return boolean from tokenRepo and throw error here instead?

    return await this.genTokenPair(userId)
  }
}