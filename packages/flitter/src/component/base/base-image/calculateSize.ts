import type { ObjectFit as _ObjectFit } from "../../../type";

type ObjectFit = `${_ObjectFit}`;

type Size = {
  width: number;
  height: number;
};

export default function calculateSize(
  source: Size,
  container: Partial<Size>,
  objectFit: ObjectFit = "none",
) {
  const aspectRatio = source.width / source.height;
  let containerWidth = container.width ?? source.width;
  let containerHeight = container.height ?? source.height;

  if (container.width != null && container.height == null) {
    containerHeight = Math.round(container.width / aspectRatio);
  } else if (container.width == null && container.height != null) {
    containerWidth = Math.round(container.height * aspectRatio);
  }

  const imageSize = fitFunctions[objectFit](source, {
    width: containerWidth,
    height: containerHeight,
  });

  return {
    width: Math.round(containerWidth),
    height: Math.round(containerHeight),
    image: {
      width: Math.round(imageSize.width),
      height: Math.round(imageSize.height),
    },
  };
}

const fitFunctions: Record<ObjectFit, (source: Size, result: Size) => Size> = {
  fill: fillFit,
  contain: containFit,
  cover: coverFit,
  none: noneFit,
  "scale-down": scaleDownFit,
};

function fillFit(source: Size, container: Size): Size {
  return { width: container.width, height: container.height };
}

function containFit(source: Size, result: Size): Size {
  const aspectRatio = source.width / source.height;
  if (result.width / result.height > aspectRatio) {
    return { width: result.height * aspectRatio, height: result.height };
  } else {
    return { width: result.width, height: result.width / aspectRatio };
  }
}

function coverFit(source: Size, container: Size): Size {
  const aspectRatio = source.width / source.height;
  if (container.width / container.height > aspectRatio) {
    return { width: container.width, height: container.width / aspectRatio };
  } else {
    return { width: container.height * aspectRatio, height: container.height };
  }
}

function noneFit(source: Size, _: Size): Size {
  return { width: source.width, height: source.height };
}

function scaleDownFit(source: Size, container: Size): Size {
  const containSize = containFit(source, container);
  if (containSize.width > source.width || containSize.height > source.height) {
    return { width: source.width, height: source.height };
  }
  return containSize;
}
