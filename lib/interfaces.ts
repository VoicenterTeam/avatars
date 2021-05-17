export interface Config {
  avatarsPath: string;
  templatesPath: string;
  sizes: Array<number>;
}

export interface CropCoordinates {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface AvatarGenerateInput {
  AvatarAccountID: number;
  AvatarID: number;
  AvatarData: {
    TemplateID: number
    Hex: string;
  }
}

export interface AvatarUploadInput {
  AvatarAccountID: number;
  AvatarID: number;
  AvatarData: {
    Coordinates: CropCoordinates;
    File: string;
  }
}
