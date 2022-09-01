import { HttpGetClient } from './client'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any> ({ url, params }: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
