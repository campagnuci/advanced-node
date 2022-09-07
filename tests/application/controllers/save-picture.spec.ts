import { HttpResponse, badRequest } from '@/application/helpers'
import { RequiredFieldError, InvalidMimeTypeError } from '@/application/errors'

type HttpRequest = { file: { buffer: Buffer, mimeType: string } }
type Model = Error

class SavePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg']))
  }
}

describe('SavePictureController', () => {
  let buffer: Buffer
  let sut: SavePictureController
  let mimeType: string

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
  })

  beforeEach(() => {
    sut = new SavePictureController()
  })

  test('should return 400 if file is not provided (undefined)', async () => {
    const httpResponse = await sut.handle({ file: undefined as any })
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('file')))
  })

  test('should return 400 if file is not provided (null)', async () => {
    const httpResponse = await sut.handle({ file: null as any })
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('file')))
  })

  test('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType } })
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('file')))
  })

  test('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' } })
    expect(httpResponse).toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' } })
    expect(httpResponse).not.toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' } })
    expect(httpResponse).not.toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' } })
    expect(httpResponse).not.toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })
})
