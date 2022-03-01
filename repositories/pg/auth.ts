import pg from 'pg'

import Pool from './storage.js'
import User from '../../models/user.js'
import {NotUniqueError, NotFoundError} from '../../errors/httpErrors.js'
import { IAuthRepo } from '../../services/auth.js'

export default class AuthRepo implements IAuthRepo {
  protected pgPool = Pool

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
  
    const id = Number(res.rows[0].id) //TODO: hardcoded column name
    if (isNaN(id))
      throw new Error("Couldn't convert returned id to Number while creating user")
  
    return id
  }
  
  async find(nickname: string): Promise<User> {
    const query = 'SELECT * FROM users WHERE nickname = $1'
    const values = [nickname]
    const res = await this.pgPool.query(query, values)
  
    if (res.rowCount === 0) 
      throw new NotFoundError('nickname')
    
    return new User(res.rows[0].nickname, res.rows[0].password, res.rows[0].id)
  }
}
