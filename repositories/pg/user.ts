import {Pool} from 'pg'

import {User, DbUser} from '../../models/user.js'
import {NotUniqueError, NotFoundError} from '../../errors/httpErrors.js'
import { IUserRepo } from '../../services/auth.js'

export default class UserRepo implements IUserRepo {
  constructor(protected pgPool: Pool) {}

  async create(user: User): Promise<number> {
    const query = 'INSERT INTO users(nickname, password) VALUES($1, $2) RETURNING id'
    const values = [user.nickname, user.password]
    try {
      var res = await this.pgPool.query(query, values)
    } catch (err: any) { 
      if (err.code === '23505')  //unique_violation
        //TODO: terrible, unique violation could occur in a different column if table is expanded with new columns
        throw new NotUniqueError("nickname")
      else
        throw err
    }
  
    const id = Number(res.rows[0].id) //TODO: hardcoded column name 'id'
    if (isNaN(id))
      throw new Error("Couldn't convert returned id to Number while creating user")
  
    return id
  }
  
  async find(nickname: string): Promise<DbUser> {
    const query = 'SELECT * FROM users WHERE nickname = $1'
    const values = [nickname]
    const res = await this.pgPool.query(query, values)
  
    if (res.rowCount === 0) 
      throw new NotFoundError('nickname')
    
    return new DbUser(res.rows[0].nickname, res.rows[0].password, res.rows[0].id)
  }
}
