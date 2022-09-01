export class UserProfile {
  initials?: string
  imageUrl?: string
  constructor (readonly id: string) {}

  setPicture ({ imageUrl, name }: { imageUrl?: string, name?: string }): void {
    this.imageUrl = imageUrl
    if (imageUrl === undefined && name !== undefined && name !== '') {
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift() ?? ''}${firstLetters.pop() ?? ''}`.toUpperCase()
      } else {
        this.initials = name.substr(0, 2).toUpperCase()
      }
    }
  }
}
