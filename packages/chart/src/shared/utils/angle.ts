export function degToRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function radToDeg(value: number): number {
  return (value * 180) / Math.PI;
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
) {
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  };
}

export function cartesianToPolar(
  centerX: number,
  centerY: number,
  x: number,
  y: number,
) {
  return {
    radius: Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2),
    angle: Math.atan2(y - centerY, x - centerX),
  };
}
