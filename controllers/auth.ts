import {Request, Response, NextFunction} from 'express'

import User from '../models/user.js'
import AuthService from '../services/auth.js'

export default class AuthController {
  constructor(protected authService: AuthService) {}

  async withUser(req: Request, res: Response, next: NextFunction) {
    req.user = new User(req.body.nickname, req.body.password)

    next()
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      var id = await this.authService.signup(req.user)
      res.json({id})
    } catch (err: any) {
      next(err)
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      var id = await this.authService.signin(req.user)
      res.json({id})
    } catch (err: any) {
      next(err)
    }
  }
}