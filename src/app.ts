import express, {Request, Response, NextFunction} from 'express'
//import pg from 'pg'
//import { createClient } from 'redis'

import { PORT } from './utils/config.js'
import * as logger from './utils/logger.js'
import AuthController from './controllers/auth.js' 
import AuthService from './services/auth.js'
import UserRepo from './repositories/memory/user.js'
import * as middleware from './utils/middleware.js'
import TokenRepo from './repositories/memory/token.js'
import TokenService from './services/token.js'


const app = express()
app.use(express.json())

if (process.env.NODE_ENV !== 'production')
  app.use(middleware.requestLogger)

//Dependencies
// let pgPool = new pg.Pool()
// let userRepo = new UserRepo(pgPool)
const userRepo = new UserRepo()
// const rds = createClient()
// rds.connect()
// const tokenRepo = new TokenRepo(rds)
const tokenRepo = new TokenRepo()
const tokenService = new TokenService(tokenRepo)
const authService = new AuthService(userRepo, tokenService)
const authController = new AuthController(authService, tokenService)

//Routes and middlewares
app.use(['/auth/signup', '/auth/signin'], (req: Request, res: Response, next: NextFunction) => authController.withUser(req, res, next))
app.post('/auth/signup', (req: Request, res: Response, next: NextFunction) => authController.signup(req, res, next))
app.post('/auth/signin', (req: Request, res: Response, next: NextFunction) => authController.signin(req, res, next))

app.use('/auth/refresh', (req: Request, res: Response, next: NextFunction) => authController.withPayload(req, res, next))
app.post('/auth/refresh', (req: Request, res: Response, next: NextFunction) => authController.refresh(req, res, next))

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`)
}).on('error', err => {
  logger.error(err)
  process.exit(1)
})