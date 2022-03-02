import express, {Request, Response, NextFunction} from 'express'
//import pg from 'pg'
import { createClient } from 'redis'

import AuthController from './controllers/auth.js' 
import AuthService from './services/auth.js'
import UserRepo from './repositories/memory/user.js'
import * as middleware from './utils/middleware.js'
import TokenRepo from './repositories/redis/token.js'
import TokenService from './services/token.js'


const app = express()
app.use(express.json())

if (process.env.NODE_ENV !== 'production')
  app.use(middleware.requestLogger)

//Dependencies
// let pgPool = new pg.Pool()
// let userRepo = new UserRepo(pgPool)
let rds = createClient()
rds.connect()
let userRepo = new UserRepo()
let tokenRepo = new TokenRepo(rds)
let tokenService = new TokenService(tokenRepo)
let authService = new AuthService(userRepo, tokenService)
let authController = new AuthController(authService, tokenService)

//Routes and middlewares
app.use(['/auth/signup', '/auth/signin'], (req: Request, res: Response, next: NextFunction) => authController.withUser(req, res, next))
app.post('/auth/signup', (req: Request, res: Response, next: NextFunction) => authController.signup(req, res, next))
app.post('/auth/signin', (req: Request, res: Response, next: NextFunction) => authController.signin(req, res, next))

app.use('/auth/refresh', (req: Request, res: Response, next: NextFunction) => authController.withPayload(req, res, next))
app.post('/auth/refresh', (req: Request, res: Response, next: NextFunction) => authController.refresh(req, res, next))

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app