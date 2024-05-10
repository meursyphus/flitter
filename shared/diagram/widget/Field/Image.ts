import { CustomPaint, Size } from '@meursyphus/flitter';

function Image({ width, height, src }: { width: number; height: number; src: string }) {
	return CustomPaint({
		size: new Size({ width, height }),
		painter: {
			dependencies: {
				width,
				height,
				src
			},
			shouldRepaint(oldPainter) {
				const oldDependencies = oldPainter.dependencies;

				return (
					oldDependencies.width !== width ||
					oldDependencies.height !== height ||
					oldDependencies.src !== src
				);
			},
			createDefaultSvgEl: (context) => ({
				image: context.createSvgEl('image')
			}),
			paint({ image }, size) {
				image.setAttribute('width', `${size.width}`);
				image.setAttribute('height', `${size.height}`);
				image.setAttribute('href', src);
			}
		}
	});
}

export default Image;
