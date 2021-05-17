import fs from "fs";
import * as defaultConfig from "config";
import { AvatarGenerateInput, AvatarUploadInput, Config } from "./interfaces";
import { cropAndSaveAvatars, generateAvatarsFromTemplate } from "./services";

export class Avatar {
  config: Config;

  constructor(config) {
    if (config.avatarsPath && config.templatesPath && config.sizes) {
      this.config = config;
    } else {
      this.config = defaultConfig;
    }
  }

  generate(inputBody: AvatarGenerateInput) {
    const { AvatarAccountID, AvatarID, AvatarData } = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.TemplateID || !AvatarData.Hex) {
      console.log("Wrong request object");

      return;
    }

    const outAvatarsDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    fs.mkdir(outAvatarsDirectory, { recursive: true }, (error) => {
      generateAvatarsFromTemplate(AvatarData.TemplateID, AvatarData.Hex, outAvatarsDirectory);

      if (error) {
        console.log(error);
      }
    });
  }

  upload(inputBody: AvatarUploadInput) {
    const { AvatarAccountID, AvatarData, AvatarID } = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.Coordinates || !AvatarData.File) {
      console.log("Wrong request object");

      return;
    }

    const { width, height, left, top } = AvatarData.Coordinates
    if (!width || !height || !left || !top) {
      console.log("Wrong coordinates object");

      return;
    }

    const outAvatarDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    fs.mkdir(outAvatarDirectory, {recursive: true}, (error) => {
      cropAndSaveAvatars(AvatarData.File, AvatarData.Coordinates, outAvatarDirectory);

      if (error) {
        console.log(error);
      }
    });
  }
}
