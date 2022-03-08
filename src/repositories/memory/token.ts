import { UnauthorizedError } from '../../errors/httpErrors.js'
import { ITokenRepo } from '../../services/token.js'

export default class TokenRepo implements ITokenRepo {
  storage: Map<string, number> = new Map()

  async create(uuid: string, userId: number, exp: number) {
    this.storage.set(uuid, userId)

    setTimeout(() => {
      this.storage.delete(uuid)
    }, exp * 1000)
  }
  
  async find(uuid: string): Promise<number> {
    const userId = this.storage.get(uuid)
    if (!userId)
      throw new UnauthorizedError('token')

    return userId
  }

  async remove(uuid: string): Promise<number> {
    const userId = this.storage.get(uuid)
    if (userId)
      this.storage.delete(uuid)
    else
      throw new UnauthorizedError('token')
    
    return userId
  }
}