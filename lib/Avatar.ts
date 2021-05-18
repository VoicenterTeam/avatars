import fs from "fs";
import sharp from "sharp";
import { registerFont, createCanvas } from 'canvas';
import defaultFontOptions from "../config/fonts";
import {
  AvatarGenerateFromContentInput,
  AvatarGenerateFromTemplateInput,
  AvatarUploadInput,
  Config,
  FontOptions
} from "./interfaces";

export class Avatar {
  config: Config;
  fontOptions: FontOptions;

  constructor(config) {
    if (!config.avatarsPath && !config.templatesPath && !config.sizes) {
      throw new Error('Config not provided');
    }

    this.config = config;
    this.fontOptions = defaultFontOptions;

    registerFont(defaultFontOptions.fontFile.other, { family: defaultFontOptions.fontFamily.other });
    registerFont(defaultFontOptions.fontFile.hebrew, { family: defaultFontOptions.fontFamily.hebrew });
  }

  public generateFromContent(inputBody: AvatarGenerateFromContentInput) {
    const { AvatarAccountID, AvatarID, AvatarData } = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.Content || !AvatarData.Hex) {
      console.log("Wrong request object");

      return;
    }
    const savedAvatarsDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    fs.mkdir(savedAvatarsDirectory, {recursive: true}, (error) => {
      if (error) {
        throw error;
      }

      this.config.sizes.forEach(size => {
        const savedAvatarPath = `${savedAvatarsDirectory}/${size}.png`;

        this.createCanvasImage(AvatarData.Content, size, AvatarData.Hex, savedAvatarPath);
      });
    });
  }

  public generateFromTemplate(inputBody: AvatarGenerateFromTemplateInput) {
    const {AvatarAccountID, AvatarID, AvatarData} = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.TemplateID || !AvatarData.Hex) {
      console.log("Wrong request object");

      return;
    }

    const savedAvatarsDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    fs.mkdir(savedAvatarsDirectory, {recursive: true}, (error) => {
      if (error) {
        throw error;
      }

      const templatePath = `${this.config.templatesPath}/${AvatarData.TemplateID}.png`;

      this.config.sizes.forEach(size => {
        sharp(templatePath)
          .resize(size, size)
          .flatten({background: AvatarData.Hex})
          .toFile(`${savedAvatarsDirectory}/${size}.png`);
      });
    });
  }

  public upload(inputBody: AvatarUploadInput) {
    const {AvatarAccountID, AvatarData, AvatarID} = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.Coordinates || !AvatarData.File) {
      console.log("Wrong request object");

      return;
    }

    const {width, height, left, top} = AvatarData.Coordinates;
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

  private createCanvasImage (text: string, size: number, hexColor: string, outImagePath: string) {
    const fontFamily = Avatar.checkTextContainsHebrew(text)
      ? this.fontOptions.fontFamily.hebrew
      : this.fontOptions.fontFamily.other;

    const canvas = createCanvas(size, size);
    const context = canvas.getContext('2d');

    context.fillStyle = hexColor;
    context.fillRect(0, 0, size, size);
    context.font = `${size / this.fontOptions.fontSizeRatio}px ${fontFamily}`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = '#FFFFFF';
    context.fillText(text, size/2, size/2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outImagePath, buffer);
  }

  private static checkTextContainsHebrew (text) {
    return (/[\u0590-\u05FF]/).test(text);
  }
}
