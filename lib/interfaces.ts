export interface Config {
  avatarsPath: string;
  templatesPath: string;
  sizes: Array<number>;
}

export interface FontOptions {
  fontColor: string;
  fontFamily: {
    hebrew: string;
    other: string;
  };
  fontFile: {
    hebrew: string;
    other: string;
  };
  fontSizeRatio: number;
}

export interface CropCoordinates {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface AvatarGenerateFromTemplateInput {
  AvatarAccountID: number;
  AvatarID: number;
  AvatarData: {
    TemplateID: number
    Hex: string;
  }
}

export interface AvatarGenerateFromContentInput {
  AvatarAccountID: number;
  AvatarID: number;
  AvatarData: {
    Content: string;
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
