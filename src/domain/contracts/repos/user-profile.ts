export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Params) => Promise<SaveUserPicture.Result>
}

export namespace SaveUserPicture {
  export type Params = {
    imageUrl?: string
  }

  export type Result = Promise<void>
}
