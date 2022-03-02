import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { User, userSchema } from '../models/user.js'
import AuthService from '../services/auth.js'
import TokenService from '../services/token.js'
import { UnauthorizedError } from '../errors/httpErrors.js'
import { JWT_SECRET } from '../utils/config.js'
import { TokenPayload } from '../models/token.js'

export default class AuthController {
  constructor(
    protected authService: AuthService,
    protected tokenService: TokenService
  ) {}

  async withUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userSchema.validateAsync(req.body)
    } catch(err: any) {
      next(err)
    }

    req.user = new User(req.body.nickname, req.body.password)
    next()
  }

  async withPayload(req: Request, res: Response, next: NextFunction) {
    //extract bearer token
    let authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      var token = authHeader.substring(7, authHeader.length)
    } else {
      return next(new UnauthorizedError('token'))
    }

    //verify token and extract payload
    try {
      var payload = jwt.verify(token, JWT_SECRET) as TokenPayload //TODO: async version of this function
    } catch (err: any) {
      return next(new UnauthorizedError('token'))
    }

    //put uuid from payload into request
    req.userUuid = payload.uuid
    next()
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      let tokenPair = await this.authService.signup(req.user)
      res.status(201).json(tokenPair)
    } catch (err: any) {
      next(err)
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      let tokenPair = await this.authService.signin(req.user)
      res.json(tokenPair)
    } catch (err: any) {
      next(err)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      let tokenPair = await this.tokenService.refresh(req.userUuid)
      res.json(tokenPair)
    } catch (err: any) {
      next(err)
    }
  }
}