import { UnauthorizedError } from '../../errors/httpErrors.js'
import { ITokenRepo } from '../../services/token.js'

type tokenStorage = {
  [key: string]: number
}

export default class TokenRepo implements ITokenRepo {
  storage: tokenStorage = {}

  async create(uuid: string, userId: number, exp: number) {
    this.storage[uuid] = userId

    setTimeout(() => {
      if (this.storage[uuid])
        delete this.storage[uuid]
    }, exp * 1000)
  }
  
  async find(uuid: string): Promise<number> {
    if (this.storage[uuid] === undefined)
      throw new UnauthorizedError('token')

    return Number(this.storage[uuid])
  }

  async remove(uuid: string): Promise<number> {
    const userId = this.storage[uuid]
    if (this.storage[uuid])
      delete this.storage[uuid]
    else
      throw new UnauthorizedError('token')
    
    return userId
  }
}