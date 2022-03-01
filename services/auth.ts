import User from '../models/user.js'
import { UnauthorizedError } from '../errors/httpErrors.js'

export interface IAuthRepo {
  create(user: User): Promise<number>
  find(nickname: string): Promise<User>
}

export default class AuthService {
  constructor(protected authRepo: IAuthRepo) {}

  async signup(user: User): Promise<number> {
    await user.hashPassword()

    const id = await this.authRepo.create(user)
    return id
  }

  async signin(user: User): Promise<number> {
    const dbUser = await this.authRepo.find(user.nickname)

    const match = await dbUser.validatePassword(user.password)
    if (!match)
      throw new UnauthorizedError('password')

    if (dbUser.id === undefined)
      throw new Error('id was not selected from repository? for some reason?')
    else
      return dbUser.id
  }
}