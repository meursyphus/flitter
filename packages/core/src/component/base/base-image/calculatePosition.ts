import type { ObjectPosition as _ObjectPosition } from "../../../type";
type ObjectPosition = `${_ObjectPosition}`;

const objectPositionMap: Record<ObjectPosition, { x: number; y: number }> = {
  center: { x: 0.5, y: 0.5 },
  top: { x: 0.5, y: 0 },
  right: { x: 1, y: 0.5 },
  bottom: { x: 0.5, y: 1 },
  left: { x: 0, y: 0.5 },
  "top left": { x: 0, y: 0 },
  "top right": { x: 1, y: 0 },
  "bottom left": { x: 0, y: 1 },
  "bottom right": { x: 1, y: 1 },
};

function calcSize(
  sourceSize: number,
  containerSize: number,
  imageSize: number,
  positionPercent: number,
): { s: number; sSize: number; d: number; dSize: number } {
  if (imageSize > containerSize) {
    const ratio = sourceSize / imageSize;
    const sSize = Math.min(sourceSize, containerSize * ratio);
    const s = (sourceSize - sSize) * positionPercent;
    return {
      s: Math.max(0, Math.min(s, sourceSize - sSize)),
      sSize,
      d: 0,
      dSize: containerSize,
    };
  } else {
    const d = (containerSize - imageSize) * positionPercent;
    return {
      s: 0,
      sSize: sourceSize,
      d,
      dSize: imageSize,
    };
  }
}

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

  const { x: xPercent, y: yPercent } = objectPositionMap[objectPosition];

  const horizontalResult = calcSize(
    sourceImageSize.width,
    containerWidth,
    imageWidth,
    xPercent,
  );
  const verticalResult = calcSize(
    sourceImageSize.height,
    containerHeight,
    imageHeight,
    yPercent,
  );

  return {
    sx: Math.round(horizontalResult.s),
    sy: Math.round(verticalResult.s),
    sWidth: Math.round(horizontalResult.sSize),
    sHeight: Math.round(verticalResult.sSize),
    dx: Math.round(horizontalResult.d),
    dy: Math.round(verticalResult.d),
    dWidth: Math.round(horizontalResult.dSize),
    dHeight: Math.round(verticalResult.dSize),
  };
}
