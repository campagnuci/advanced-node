export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Params) => Promise<SaveUserPicture.Result>
}

export namespace SaveUserPicture {
  export type Params = {
    imageUrl?: string
  }

  export type Result = Promise<void>
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => LoadUserProfile.Result
}

export namespace LoadUserProfile {
  export type Params = {
    id: string
  }

  export type Result = Promise<void>
}
