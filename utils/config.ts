import 'dotenv/config'

export const PORT = process.env.PORT ? process.env.PORT : '3000'

export let JWT_SECRET: string
if (!process.env.JWTSECRET) {
  throw Error('JWT_SECRET undefined')
} else {
  JWT_SECRET = process.env.JWTSECRET
}

