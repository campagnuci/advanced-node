import { adaptExpressMiddleware, Middleware } from '@/main/adapters/'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, Response, RequestHandler } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ExpressMiddleware Adapter', () => {
  let sut: RequestHandler
  let request: Request
  let response: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>

  beforeAll(() => {
    request = getMockReq({ headers: { any: 'any' } })
    response = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined,
        prop: 'any_value'
      }
    })
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  test('should call handle with correct request', async () => {
    await sut(request, response, next)
    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  test('should call handle with empty request', async () => {
    request = getMockReq()
    await sut(request, response, next)
    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  test('should respond with correct error and statusCode', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: { error: 'any_error' }
    })
    await sut(request, response, next)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })

  test('should add valid data to req.locals', async () => {
    await sut(request, response, next)
    expect(request.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
