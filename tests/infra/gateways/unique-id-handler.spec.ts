import { UniqueId } from '@/infra/gateways'

describe('UniqueId Handler', () => {
  let sut: UniqueId

  test('should call uuid.v4 correctly', () => {
    sut = new UniqueId(new Date(2022, 8, 1, 10, 10, 10))
    const uuid = sut.uuid({ key: 'any_key' })
    expect(uuid).toBe('any_key_20220901101010')
  })

  test('should call uuid.v4 correctly', () => {
    sut = new UniqueId(new Date(2018, 2, 10, 18, 1, 0))
    const uuid = sut.uuid({ key: 'any_key' })
    expect(uuid).toBe('any_key_20180310180100')
  })
})
