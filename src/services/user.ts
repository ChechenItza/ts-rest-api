import { User, DbUser } from '../models/user.js'

export interface IUserRepo {
  create(user: User): Promise<number>
  find(value: string | number): Promise<DbUser>
}

export default class UserService {
  constructor(
    protected userRepo: IUserRepo,
  ) {}

  async find(userId: number): Promise<DbUser> {
    return this.userRepo.find(userId)
  }
}