import { Controller, SavePictureController } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

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
    userId = 'any_user_id'
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', imageUrl: 'any_url' })
  })

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })

  test('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId })
    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
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
