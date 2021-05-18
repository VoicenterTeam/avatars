import * as config from "config";
import { CropCoordinates } from "./interfaces";
import { colorAndResizeImage, cropAndResizeBinaryImage } from "./sharp";

export const generateAvatarsFromTemplate = (templateId: number, hexColor: string, outDirectory: string) => {
  const templatePath = `${config.templatesPath}/${templateId}.png`;

  config.sizes.forEach(size => {
    const outAvatarPath = `${outDirectory}/${size}.png`;

    colorAndResizeImage(templatePath, outAvatarPath, hexColor, size);
  });
}

export const cropAndSaveAvatars = (binaryImageData: string, coordinates: CropCoordinates, outDirectory: string) => {
  const base64Image = binaryImageData.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  config.sizes.forEach(size => {
    const outAvatarPath = `${outDirectory}/${size}.png`;

    cropAndResizeBinaryImage(imageBuffer, outAvatarPath, coordinates, size);
  });
}
