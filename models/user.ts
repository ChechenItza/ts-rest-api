import bcrypt from 'bcrypt'
import Joi from 'joi'

export class DbUser {
  constructor(
    public nickname: string, 
    public password: string,
    public id: number) 
  {}

  validatePassword(password: string): Promise<Boolean> {
    return bcrypt.compare(password, this.password)
  }
}

export class User {
  constructor(
    public nickname: string, 
    public password: string) 
  {}

  async hashPassword() {
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds)
  }
}

export const userSchema = Joi.object({
  nickname: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$&()\\-`.+,/\"]{3,30}$'))
      .required(),
      
})
  .with('nickname', 'password')