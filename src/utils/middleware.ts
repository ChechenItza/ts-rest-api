import {Request, Response, NextFunction} from 'express'

import * as logger from './logger.js'
import {HttpError} from '../errors/httpErrors.js'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

export function unknownEndpoint(req: Request, res: Response) {
  res.status(404).send({ error: 'unknown endpoint' })
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err)

  if (err instanceof HttpError) {
    return res.status(err.status).json({error: err.message})
  } else if (err.message !== undefined) {
    return res.status(500).json({error: err.message})
  } else {
    return res.status(500).end()
  }
}