import { mkdir, writeFile } from "fs/promises";
import sharp from "sharp";
import { registerFont, createCanvas } from 'canvas';
import defaultFontOptions from "../config/fonts";
import defaultImageSizes from "../config/imageSizes";
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
  imageSizes: number[]

  constructor(config) {
    if (!config.avatarsPath && !config.templatesPath) {
      throw new Error("Config not provided");
    }

    if (config.sizes && config.sizes.length > 0) {
      this.imageSizes = config.sizes;
    } else {
      this.imageSizes = defaultImageSizes;
    }

    this.config = config;
    this.config.avatarsPath += '/';
    this.config.templatesPath += '/';

    this.fontOptions = defaultFontOptions;
    registerFont(defaultFontOptions.fontFile.other, { family: defaultFontOptions.fontFamily.other });
    registerFont(defaultFontOptions.fontFile.hebrew, { family: defaultFontOptions.fontFamily.hebrew });
  }

  public async generateFromContent(inputBody: AvatarGenerateFromContentInput) {
    const { AvatarAccountID, AvatarID, AvatarData } = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.Content || !AvatarData.Hex) {
      throw new Error("Wrong input object");
    }

    const savedAvatarsDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    await mkdir(savedAvatarsDirectory, {recursive: true});

    for (const size of this.imageSizes) {
      const savedAvatarPath = `${savedAvatarsDirectory}/${size}.png`;

      await this.createCanvasImage(AvatarData.Content, size, AvatarData.Hex, savedAvatarPath);
    }

    return savedAvatarsDirectory;
  }

  public async generateFromTemplate(inputBody: AvatarGenerateFromTemplateInput) {
    const {AvatarAccountID, AvatarID, AvatarData} = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.TemplateID || !AvatarData.Hex) {
      throw new Error("Wrong input object");
    }

    const savedAvatarsDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    await mkdir(savedAvatarsDirectory, {recursive: true});

    const templatePath = `${this.config.templatesPath}/${AvatarData.TemplateID}.png`;

    for (const size of this.imageSizes) {
      await sharp(templatePath)
          .resize(size, size)
          .flatten({background: AvatarData.Hex})
          .toFile(`${savedAvatarsDirectory}/${size}.png`);
    }

    return savedAvatarsDirectory;
  }

  public async upload(inputBody: AvatarUploadInput) {
    const {AvatarAccountID, AvatarData, AvatarID} = inputBody;

    if (!AvatarAccountID || !AvatarID || !AvatarData || !AvatarData.Coordinates || !AvatarData.File) {
      throw new Error("Wrong input object");
    }

    const {width, height, left, top} = AvatarData.Coordinates;
    if (!width || !height || left == null || top == null) {
      throw new Error("Wrong coordinates object");
    }

    const savedAvatarDirectory = `${this.config.avatarsPath}/${AvatarAccountID}/${AvatarID}`;

    await mkdir(savedAvatarDirectory, {recursive: true});

    const base64Image = AvatarData.File.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');

    for (const size of this.imageSizes) {
      await sharp(imageBuffer)
          .extract(AvatarData.Coordinates)
          .resize(size, size)
          .toFile(`${savedAvatarDirectory}/${size}.png`)
    }

    return savedAvatarDirectory;
  }

  private async createCanvasImage (text: string, size: number, hexColor: string, outImagePath: string) {
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
    await writeFile(outImagePath, buffer);
  }

  private static checkTextContainsHebrew (text) {
    return (/[\u0590-\u05FF]/).test(text);
  }
}
