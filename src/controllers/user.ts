import { Request, Response, NextFunction } from 'express'

import UserService from '../services/user.js'
import TokenService from '../services/token.js'

export default class UserController {
  constructor(
    protected userService: UserService,
    protected tokenService: TokenService
  ) {}

  async withUserId(req: Request, res: Response, next: NextFunction) {
    try {
      // eslint-disable-next-line no-var
      var userId = await this.tokenService.getUserId(req.userUuid)
    } catch (err: any) {
      return next(err)
    }

    req.userId = userId
    next()
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.find(req.userId)
      res.json(user)
    } catch (err: any) {
      next(err)
    }
  }
}