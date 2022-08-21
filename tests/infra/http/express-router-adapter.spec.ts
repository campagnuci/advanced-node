import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (request: Request, response: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...request.body })
    if (httpResponse.statusCode === 200) {
      response.status(200).json(httpResponse.data)
    } else {
      response.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
  }
}

describe('Express Router Adapter', () => {
  let controller: MockProxy<Controller>
  let sut: ExpressRouter
  let request: Request
  let response: Response

  beforeEach(() => {
    request = getMockReq({ body: { any: 'any_data' } })
    response = getMockRes().res
    controller = mock()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { content: 'any_content' }
    })
    sut = new ExpressRouter(controller)
  })

  test('should call handle with correct request', async () => {
    await sut.adapt(request, response)
    expect(controller.handle).toHaveBeenCalledWith({ any: 'any_data' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('should call handle with empty request', async () => {
    const req = getMockReq()
    await sut.adapt(req, response)
    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('should respond with 200 and valid data', async () => {
    await sut.adapt(request, response)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ content: 'any_content' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })

  test('should respond with 400 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_controller_error')
    })
    await sut.adapt(request, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ error: 'any_controller_error' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })

  test('should respond with 500 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_controller_error')
    })
    await sut.adapt(request, response)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ error: 'any_controller_error' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })
})
