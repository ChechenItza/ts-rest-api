import { User } from '../models/user.js'
import { TokenPair } from '../models/token.js'
import { UnauthorizedError } from '../errors/httpErrors.js'
import { IUserRepo } from './user.js'
import TokenService from './token.js'

export default class AuthService {
  constructor(
    protected userRepo: IUserRepo,
    protected tokenService: TokenService
  ) {}

  async signup(user: User): Promise<TokenPair> {
    await user.hashPassword()

    const userId = await this.userRepo.create(user)
    return this.tokenService.genTokenPair(userId)
  }

  async signin(user: User): Promise<TokenPair> {
    const dbUser = await this.userRepo.find(user.nickname)

    const match = await dbUser.validatePassword(user.password)
    if (!match)
      throw new UnauthorizedError('password')

    return this.tokenService.genTokenPair(dbUser.id)
  }
}