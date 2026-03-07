type RGB = {
  r: number;
  g: number;
  b: number;
};

function normalizeHex(value: string): string {
  const hex = value.replace("#", "").trim();
  if (hex.length === 3) {
    return hex
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }
  return hex;
}

function parseHex(value: string): RGB {
  const hex = normalizeHex(value);
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function toHex(value: number): string {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
}

export function interpolateColor(from: string, to: string, ratio: number): string {
  const start = parseHex(from);
  const end = parseHex(to);
  const t = Math.max(0, Math.min(1, ratio));

  return `#${toHex(start.r + (end.r - start.r) * t)}${toHex(
    start.g + (end.g - start.g) * t,
  )}${toHex(start.b + (end.b - start.b) * t)}`;
}

export function interpolateColorStops(
  colors: string[],
  ratio: number,
): string {
  if (colors.length === 0) return "#000000";
  if (colors.length === 1) return colors[0];

  const clamped = Math.max(0, Math.min(1, ratio));
  const scaled = clamped * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(scaled));
  const localRatio = scaled - index;
  return interpolateColor(colors[index], colors[index + 1], localRatio);
}
