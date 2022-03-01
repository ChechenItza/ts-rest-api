import express, {Request, Response, NextFunction} from 'express'

import AuthController from './controllers/auth.js' 
import AuthService from './services/auth.js'
import AuthRepo from './repositories/pg/auth.js'
import * as middleware from './utils/middleware.js'

const app = express()
app.use(express.json())

if (process.env.NODE_ENV !== 'production')
  app.use(middleware.requestLogger)

let authRepo = new AuthRepo()
let authService = new AuthService(authRepo)
let authController = new AuthController(authService)

app.use(['/auth/signup', '/auth/signin'], (req: Request, res: Response, next: NextFunction) => authController.withUser(req, res, next))
app.post('/auth/signup', (req: Request, res: Response, next: NextFunction) => authController.signup(req, res, next))
app.post('/auth/signin', (req: Request, res: Response, next: NextFunction) => authController.signin(req, res, next))

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app