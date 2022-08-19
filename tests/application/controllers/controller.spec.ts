import { Controller } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { HttpResponse } from '@/application/helpers'

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeAll(() => {
  })

  beforeEach(() => {
    sut = new ControllerStub()
  })

  test('should return 400 if validation fails', async () => {
    expect(1).toBe(1)
  })

  test('should return 500 if perform throws', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)
    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual(sut.result)
  })
})
