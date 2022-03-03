import {User, DbUser} from '../../models/user.js'
import {NotUniqueError, NotFoundError} from '../../errors/httpErrors.js'
import { IUserRepo } from '../../services/auth.js'

type userStorage = {
  [key: string]: DbUser
}

export default class UserRepo implements IUserRepo {
  counter = 1
  storage: userStorage = {}

  async create(user: User): Promise<number> {
    if (this.storage[user.nickname])
      throw new NotUniqueError('nickname')

    const dbUser = new DbUser(user.nickname, user.password, this.counter)
    this.storage[user.nickname] = dbUser
    this.counter += 1
    return Promise.resolve(this.counter - 1)
  }
  
  async find(nickname: string): Promise<DbUser> {
    if (!this.storage[nickname])
      throw new NotFoundError('nickname')
    
    return Promise.resolve(this.storage[nickname])
  }
}