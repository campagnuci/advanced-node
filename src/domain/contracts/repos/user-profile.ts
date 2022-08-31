export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Params) => Promise<SaveUserPicture.Result>
}

export namespace SaveUserPicture {
  export type Params = {
    id: string
    imageUrl?: string
    initials?: string
  }

  export type Result = Promise<void>
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<LoadUserProfile.Result>
}

export namespace LoadUserProfile {
  export type Params = {
    id: string
  }

  export type Result = {
    name?: string
  }
}
