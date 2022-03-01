import bcrypt from 'bcrypt'

export default class User {
  constructor(
    public nickname: string, 
    public password: string, 
    public id?: number) 
  {}

  async hashPassword() {
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds)
  }
  
  validatePassword(password: string): Promise<Boolean> {
    return bcrypt.compare(password, this.password)
  }
}