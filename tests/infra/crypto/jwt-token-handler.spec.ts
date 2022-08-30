import { JwtTokenHandler } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generate', () => {
    let key: string
    let token: string
    let expirationInMs: number

    beforeAll(() => {
      expirationInMs = 1000
      key = 'any_key'
      token = 'any_token'
      fakeJwt = jwt as jest.Mocked<typeof jwt>
      fakeJwt.sign.mockImplementation(() => token)
    })

    test('should call sign with correct params', async () => {
      await sut.generate({ key, expirationInMs })
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    test('should return a token', async () => {
      const generatedToken = await sut.generate({ key, expirationInMs })
      expect(generatedToken).toBe(token)
    })

    test('should throw if axios.get throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })
      const promise = sut.generate({ key, expirationInMs })
      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })

  describe('validate', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })

    test('should call sign with correct params', async () => {
      await sut.validate({ token })
      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    test('should return the key used to sign', async () => {
      const generatedKey = await sut.validate({ token })
      expect(generatedKey).toBe(key)
    })

    test('should throw if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('key_error') })
      const promise = sut.validate({ token })
      await expect(promise).rejects.toThrow(new Error('key_error'))
    })

    test('should throw if verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)
      const promise = sut.validate({ token })
      await expect(promise).rejects.toThrow()
    })

    test('should throw if verify returns undefined', async () => {
      fakeJwt.verify.mockImplementationOnce(() => undefined)
      const promise = sut.validate({ token })
      await expect(promise).rejects.toThrow()
    })
  })
})
