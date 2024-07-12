import type { ObjectPosition as _ObjectPosition } from "../../../type";

type ObjectPosition = `${_ObjectPosition}`;

export default function calculateImageRendering(
  sourceImageSize: { width: number; height: number },
  calcImageSizeResult: {
    container: { width: number; height: number };
    image: { width: number; height: number };
  },
  objectPosition: ObjectPosition = "center",
): {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
} {
  const {
    container: { width: containerWidth, height: containerHeight },
    image: { width: imageWidth, height: imageHeight },
  } = calcImageSizeResult;

  let sx = 0,
    sy = 0;
  let dx = 0,
    dy = 0;
  const dWidth = imageWidth;
  const dHeight = imageHeight;

  // Convert objectPosition to x and y percentages
  let xPercent = 50,
    yPercent = 50;
  if (objectPosition.includes("left")) xPercent = 0;
  if (objectPosition.includes("right")) xPercent = 100;
  if (objectPosition.includes("top")) yPercent = 0;
  if (objectPosition.includes("bottom")) yPercent = 100;

  if (imageWidth > containerWidth || imageHeight > containerHeight) {
    // Image is larger than container, need to adjust source rectangle
    const widthRatio = sourceImageSize.width / imageWidth;
    const heightRatio = sourceImageSize.height / imageHeight;

    const sWidth = Math.min(sourceImageSize.width, containerWidth * widthRatio);
    const sHeight = Math.min(
      sourceImageSize.height,
      containerHeight * heightRatio,
    );

    sx = ((sourceImageSize.width - sWidth) * xPercent) / 100;
    sy = ((sourceImageSize.height - sHeight) * yPercent) / 100;

    // Ensure source rectangle doesn't exceed original image bounds
    sx = Math.max(0, Math.min(sx, sourceImageSize.width - sWidth));
    sy = Math.max(0, Math.min(sy, sourceImageSize.height - sHeight));

    return {
      sx: Math.round(sx),
      sy: Math.round(sy),
      sWidth: Math.round(sWidth),
      sHeight: Math.round(sHeight),
      dx: 0,
      dy: 0,
      dWidth: Math.round(containerWidth),
      dHeight: Math.round(containerHeight),
    };
  } else {
    // Image is smaller than or equal to container, adjust position within container
    dx = Math.round(((containerWidth - imageWidth) * xPercent) / 100);
    dy = Math.round(((containerHeight - imageHeight) * yPercent) / 100);

    return {
      sx: 0,
      sy: 0,
      sWidth: Math.round(sourceImageSize.width),
      sHeight: Math.round(sourceImageSize.height),
      dx: Math.round(dx),
      dy: Math.round(dy),
      dWidth: Math.round(dWidth),
      dHeight: Math.round(dHeight),
    };
  }
}
