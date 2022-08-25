import { Middleware } from '@/application/middlewares'
import { RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = (middleware) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (request, response, next) => {
    const { statusCode, data } = await middleware.handle({ ...request.headers })
    if (statusCode === 200) {
      const entries = Object.entries(data).filter((item) => item[1])
      request.locals = { ...request.locals, ...Object.fromEntries(entries) }
      next()
    } else {
      response.status(statusCode).json({ error: data.message })
    }
  }
}
