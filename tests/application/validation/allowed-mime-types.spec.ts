import { InvalidMimeTypeError } from '@/application/errors'
import { AllowerdMimeTypes } from '@/application/validation'

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowerdMimeTypes(['png'], 'image/jpg')
    const error = sut.validate()
    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowerdMimeTypes(['png'], 'image/png')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowerdMimeTypes(['jpg'], 'image/jpg')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowerdMimeTypes(['jpg'], 'image/jpeg')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
