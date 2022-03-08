import express from 'express'

import { PORT } from './utils/config.js'
import * as logger from './utils/logger.js'
import AuthController from './controllers/auth.js' 
import AuthService from './services/auth.js'
import UserRepo from './repositories/memory/user.js'
import * as middleware from './utils/middleware.js'
import TokenRepo from './repositories/memory/token.js'
import TokenService from './services/token.js'
import UserService from './services/user.js'
import UserController from './controllers/user.js'


const app = express()
app.use(express.json())

if (process.env.NODE_ENV !== 'production')
  app.use(middleware.requestLogger)

//Dependencies
const userRepo = new UserRepo()
const tokenRepo = new TokenRepo()
const tokenService = new TokenService(tokenRepo)
const authService = new AuthService(userRepo, tokenService)
const userService = new UserService(userRepo)

const authController = new AuthController(authService, tokenService)
const userController = new UserController(userService, tokenService)

//Routes and middleware
app.use(['/auth/signup', '/auth/signin'], authController.withUser.bind(authController))
app.post('/auth/signup', authController.signup.bind(authController))
app.post('/auth/signin', authController.signin.bind(authController))

app.use(['/auth/refresh', '/users*'], authController.withPayload.bind(authController))

app.post('/auth/refresh', authController.refresh.bind(authController))

app.use('/users*', userController.withUserId.bind(userController))
app.get('/users/me', userController.me.bind(userController))

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`)
}).on('error', err => {
  logger.error(err)
  process.exit(1)
})