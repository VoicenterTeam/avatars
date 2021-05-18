import fs from "fs";
import sharp from "sharp";
import * as defaultConfig from "config";
import { AvatarGenerateInput, AvatarUploadInput, Config } from "./interfaces";

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

    const savedAvatarsDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    fs.mkdir(savedAvatarsDirectory, { recursive: true }, (error) => {
      if (error) {
        throw error;
      }

      const templatePath = `${this.config.templatesPath}/${AvatarData.TemplateID}.png`;

      this.config.sizes.forEach(size => {
        sharp(templatePath)
          .resize(size, size)
          .flatten({ background: AvatarData.Hex })
          .toFile(`${savedAvatarsDirectory}/${size}.png`);
      });
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

    const savedAvatarDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    fs.mkdir(savedAvatarDirectory, {recursive: true}, (error) => {
      if (error) {
        throw error;
      }

      const base64Image = AvatarData.File.split(';base64,').pop();
      const imageBuffer = Buffer.from(base64Image, 'base64');

      this.config.sizes.forEach(size => {
        sharp(imageBuffer)
          .extract(AvatarData.Coordinates)
          .resize(size, size)
          .toFile(`${savedAvatarDirectory}/${size}.png`);
      });
    });
  }
}
