export abstract class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    Object.setPrototypeOf(this, HttpError.prototype)

    this.name = 'HttpError'
  }
}

export class NotUniqueError extends HttpError {
  constructor(field: string) {
    super(409, `this ${field} already exists`)
    Object.setPrototypeOf(this, NotUniqueError.prototype)

    this.name = 'NotUniqueError'
  }
}

export class NotFoundError extends HttpError {
  constructor(field: string) {
    super(404, `this ${field} doesn't exist`)
    Object.setPrototypeOf(this, NotFoundError.prototype)

    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends HttpError {
  constructor(field: string) {
    super(401, `invalid ${field}`)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)

    this.name = 'UnauthorizedError'
  }
}