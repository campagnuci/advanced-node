import { AxiosHttpClient } from '@/infra/gateways'

export const makeAxiosClient = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}
