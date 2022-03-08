import {Pool} from 'pg'

import {User, DbUser} from '../../models/user.js'
import {NotUniqueError, NotFoundError} from '../../errors/httpErrors.js'
import { IUserRepo } from '../../services/user.js'

export default class UserRepo implements IUserRepo {
  constructor(protected pgPool: Pool) {}

  async create(user: User): Promise<number> {
    const query = 'INSERT INTO users(nickname, password) VALUES($1, $2) RETURNING id'
    const values = [user.nickname, user.password]
    try {
      // eslint-disable-next-line no-var
      var res = await this.pgPool.query(query, values)
    } catch (err: any) { 
      if (err.code === '23505')  //unique_violation
        //TODO: unique violation could occur in a different column if table is expanded with new columns
        throw new NotUniqueError('nickname')
      else
        throw err
    }
  
    const id = Number(res.rows[0].id) //TODO: hardcoded column name 'id'
    if (isNaN(id))
      throw new Error('Couldn\'t convert returned id to Number while creating user')
  
    return id
  }
  
  async find(value: string | number): Promise<DbUser> {
    if (typeof value === 'string')
      // eslint-disable-next-line no-var
      var column = 'nickname'
    else
      // eslint-disable-next-line no-var
      var column = 'id'
    
    const query = 'SELECT * FROM users WHERE ' + column + ' = $1'
    const values = [value]
    const res = await this.pgPool.query(query, values)
  
    if (res.rowCount === 0)
      throw new NotFoundError(column)
      
    return new DbUser(res.rows[0].nickname, res.rows[0].password, res.rows[0].id)
  }
}
