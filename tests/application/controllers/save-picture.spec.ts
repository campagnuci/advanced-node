import { badRequest } from '@/application/helpers'
import { RequiredFieldError, InvalidMimeTypeError, MaxFileSizeError } from '@/application/errors'
import { Controller, SavePictureController } from '@/application/controllers'

describe('SavePictureController', () => {
  let buffer: Buffer
  let sut: SavePictureController
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let changeProfilePicture: jest.Mock
  let userId: string

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', imageUrl: 'any_url' })
    userId = 'any_user_id'
  })

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })

  test('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('should return 400 if file is not provided (undefined)', async () => {
    const httpResponse = await sut.handle({ file: undefined as any, userId })
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('file')))
  })

  test('should return 400 if file is not provided (null)', async () => {
    const httpResponse = await sut.handle({ file: null as any, userId })
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('file')))
  })

  test('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType }, userId })
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('file')))
  })

  test('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' }, userId })
    expect(httpResponse).toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId })
    expect(httpResponse).not.toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId })
    expect(httpResponse).not.toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId })
    expect(httpResponse).not.toEqual(badRequest(new InvalidMimeTypeError(['png', 'jpg', 'jpeg'])))
  })

  test('should return 400 if file size is bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId })
    expect(httpResponse).toEqual(badRequest(new MaxFileSizeError(5)))
  })

  test('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ file, userId })
    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: file.buffer })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  test('should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ file, userId })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', imageUrl: 'any_url' }
    })
  })
})
