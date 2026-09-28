import { CustomPaint, Size } from "flitter-core";

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): HTMLImageElement {
  let image = imageCache.get(src);
  if (image == null) {
    image = document.createElement("img");
    image.src = src;
    imageCache.set(src, image);
  }
  return image;
}

function Image({
  width,
  height,
  src,
}: {
  width: number;
  height: number;
  src: string;
}) {
  return CustomPaint({
    size: new Size({ width, height }),
    painter: {
      dependencies: {
        width,
        height,
        src,
      },
      shouldRepaint(oldPainter) {
        const oldDependencies = oldPainter.dependencies;

        return (
          oldDependencies.width !== width ||
          oldDependencies.height !== height ||
          oldDependencies.src !== src
        );
      },
      svg: {
        createDefaultSvgEl: (context) => ({
          image: context.createSvgEl("image"),
        }),
        paint({ image }, size) {
          image.setAttribute("width", `${size.width}`);
          image.setAttribute("height", `${size.height}`);
          image.setAttribute("href", src);
        },
      },
      canvas: {
        paint(context, size) {
          const image = loadImage(src);
          if (!image.complete || image.naturalWidth === 0) return;
          context.canvas.drawImage(image, 0, 0, size.width, size.height);
        },
      },
    },
  });
}

export default Image;
