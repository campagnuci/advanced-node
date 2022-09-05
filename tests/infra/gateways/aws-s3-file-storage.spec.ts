import { AwsS3FileStorage } from '@/infra/gateways'
import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage
  let secret: string
  let accessKey: string
  let bucket: string
  let key: string
  let file: Buffer
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock

  beforeAll(() => {
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
      putObject: putObjectSpy
    })))
  })

  beforeEach(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
    key = 'any_key'
    file = Buffer.from('any_buffer')
    sut = new AwsS3FileStorage(accessKey, secret, bucket)
  })

  test('should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })

  test('should call putObject with correct input', async () => {
    await sut.upload({ key, file })
    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  test('should return imageUrl', async () => {
    const imageUrl = await sut.upload({ key, file })
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })

  test('should return encoded imageUrl', async () => {
    const imageUrl = await sut.upload({ key: 'any key', file })
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })

  test('should rethrow if AWS putObject throws', async () => {
    const error = new Error('upload_error')
    putObjectPromiseSpy.mockRejectedValueOnce(error)
    const promise = sut.upload({ key: 'any key', file })
    await expect(promise).rejects.toThrow(error)
  })
})
