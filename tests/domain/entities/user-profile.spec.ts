import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  test('should create with empty initials when imageUrl is provided with name', () => {
    sut.setPicture({ imageUrl: 'any_url', name: 'any_name' })
    expect(sut).toEqual({
      id: 'any_id',
      imageUrl: 'any_url',
      initials: undefined
    })
  })

  test('should create with empty initials when imageUrl is provided without name', () => {
    sut.setPicture({ imageUrl: 'any_url' })
    expect(sut).toEqual({
      id: 'any_id',
      imageUrl: 'any_url',
      initials: undefined
    })
  })

  test('should create initials first letter of first and last name when camelcase', () => {
    sut.setPicture({ name: 'Vinnicius de Olivera Campagnuci' })
    expect(sut).toEqual({
      id: 'any_id',
      imageUrl: undefined,
      initials: 'VC'
    })
  })

  test('should create initials first letter of first and last name when lowercase', () => {
    sut.setPicture({ name: 'vinnicius de olivera campagnuci' })
    expect(sut).toEqual({
      id: 'any_id',
      imageUrl: undefined,
      initials: 'VC'
    })
  })

  test('should create initials first two letters of first name', () => {
    sut.setPicture({ name: 'Vinnicius' })
    expect(sut).toEqual({
      id: 'any_id',
      imageUrl: undefined,
      initials: 'VI'
    })
  })

  test('should create initials first letter', () => {
    sut.setPicture({ name: 'V' })
    expect(sut).toEqual({
      id: 'any_id',
      imageUrl: undefined,
      initials: 'V'
    })
  })

  test('should create with empty initials when name and imageUrl are not provided', () => {
    sut.setPicture({ })
    expect(sut).toEqual({
      id: 'any_id',
      imageUrl: undefined,
      initials: undefined
    })
  })
})
