import 'dotenv/config'

export const PORT = process.env.PORT ? process.env.PORT : '3000'
export const REDIS_HOST = process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost'
export const REDIS_PORT = process.env.REDIS_PORT ? process.env.REDIS_PORT : '6379'

if (!process.env.JWT_SECRET) {
  throw Error('JWT_SECRET undefined')
} 
export const JWT_SECRET = process.env.JWT_SECRET
export const ACCES_EXP = Number(process.env.ACCESS_EXP) ? Number(process.env.ACCESS_EXP) : 7200 //2 hours is default
export const REFRESH_EXP = Number(process.env.REFRESH_EXP) ? Number(process.env.REFRESH_EXP) : 604800 //7 days is default

