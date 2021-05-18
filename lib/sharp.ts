import sharp from "sharp";
import { CropCoordinates } from "./interfaces";

export const colorAndResizeImage = (inImagePath: string, outImagePath: string, hexColor: string, size: number) => {
  sharp(inImagePath)
    .resize(size, size)
    .flatten({ background: hexColor })
    .toFile(outImagePath);
}

export const cropAndResizeBinaryImage = (inImageBuffer: Buffer, outImagePath: string, cropCoordinates: CropCoordinates, size: number) => {
  sharp(inImageBuffer)
    .extract(cropCoordinates)
    .resize(size, size)
    .toFile(outImagePath);
}
