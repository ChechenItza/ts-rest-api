import User from '../../models/user.js'

declare module 'express-serve-static-core' {
  interface Request {
      user: User
      userUuid: string
      userId: number
  }
}