import {User, DbUser} from '../../models/user.js'
import {NotUniqueError, NotFoundError} from '../../errors/httpErrors.js'
import { IUserRepo } from '../../services/user.js'

export default class UserRepo implements IUserRepo {
  storage: Map<string, DbUser> = new Map()

  async create(user: User): Promise<number> {
    if (this.storage.get(user.nickname))
      throw new NotUniqueError('nickname')

    const dbUser = new DbUser(user.nickname, user.password, this.storage.size + 1)
    this.storage.set(user.nickname, dbUser)
    return Promise.resolve(this.storage.size)
  }
  
  async find(value: string | number): Promise<DbUser> {
    if (typeof value === 'string')
      return this.findByNickname(value)
    else
      return this.findById(value)
  }

  private async findByNickname(nickname: string): Promise<DbUser> {
    const dbUser = this.storage.get(nickname)
    if (dbUser !== undefined)
      return Promise.resolve(dbUser)
    else
      throw new NotFoundError('nickname')
  }

  private async findById(userId: number): Promise<DbUser> {
    for (const [nickname, dbUser] of this.storage.entries())
      if (dbUser.id === userId)
        return Promise.resolve(dbUser)

    throw new NotFoundError('id')
  }
}