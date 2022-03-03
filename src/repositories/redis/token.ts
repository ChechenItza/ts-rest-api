import { createClient } from 'redis'

import { UnauthorizedError } from '../../errors/httpErrors.js'
import { ITokenRepo } from '../../services/token.js'

type RedisClientType = ReturnType<typeof createClient>

export default class TokenRepo implements ITokenRepo {
  constructor(protected client: RedisClientType) {}

  async create(uuid: string, userId: number, exp: number) {
    await this.client.set(uuid, userId, {
      EX: exp
    })
  }
  
  async find(uuid: string): Promise<number> {
    const userId = await this.client.get(uuid)
    if (userId === null)
      throw new UnauthorizedError('token')

    return Number(userId)
  }

  async remove(uuid: string): Promise<number> {
    const userId = await this.find(uuid)

    const count = await this.client.del(uuid)
    if (count === 0) 
      throw new UnauthorizedError('token')
    
    return userId
  }
}
