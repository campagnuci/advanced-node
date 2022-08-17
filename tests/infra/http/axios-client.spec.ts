import { AxiosHttpClient } from '@/infra/http/axios-client'
import axios from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  describe('method get()', () => {
    test('should call get with correct params', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>
      const sut = new AxiosHttpClient()
      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      })
      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'any'
        }
      })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
