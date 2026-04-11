import Curve from "./Curve";

// Standard easing functions (no external dependencies)

const linear = (t: number) => t;

// Cubic bezier-based easings
const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Circular easings
const circIn = (t: number) => 1 - Math.sqrt(1 - t * t);
const circOut = (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2));
const circInOut = (t: number) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

// Back easings (overshoot)
const BACK_S = 1.70158;
const BACK_S2 = BACK_S * 1.525;

const backIn = (t: number) => (BACK_S + 1) * t * t * t - BACK_S * t * t;
const backOut = (t: number) => {
  const t1 = t - 1;
  return 1 + (BACK_S + 1) * t1 * t1 * t1 + BACK_S * t1 * t1;
};
const backInOut = (t: number) =>
  t < 0.5
    ? (Math.pow(2 * t, 2) * ((BACK_S2 + 1) * 2 * t - BACK_S2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((BACK_S2 + 1) * (t * 2 - 2) + BACK_S2) + 2) /
      2;

// Anticipate (backIn → reversed backOut)
const anticipate = (t: number) => {
  if (t < 0.5) {
    return backIn(t * 2) * 0.5;
  }
  return 0.5 + backOut((t - 0.5) * 2) * 0.5;
};

// Bounce easings
const bounceOut = (t: number) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    const t1 = t - 1.5 / d1;
    return n1 * t1 * t1 + 0.75;
  } else if (t < 2.5 / d1) {
    const t1 = t - 2.25 / d1;
    return n1 * t1 * t1 + 0.9375;
  } else {
    const t1 = t - 2.625 / d1;
    return n1 * t1 * t1 + 0.984375;
  }
};

const bounceIn = (t: number) => 1 - bounceOut(1 - t);

const bounceInOut = (t: number) =>
  t < 0.5
    ? (1 - bounceOut(1 - 2 * t)) / 2
    : (1 + bounceOut(2 * t - 1)) / 2;

export default {
  linear: new Curve(linear),
  easeIn: new Curve(easeIn),
  easeInOut: new Curve(easeInOut),
  easeOut: new Curve(easeOut),
  circIn: new Curve(circIn),
  circInOut: new Curve(circInOut),
  circOut: new Curve(circOut),
  backIn: new Curve(backIn),
  backInOut: new Curve(backInOut),
  backOut: new Curve(backOut),
  anticipate: new Curve(anticipate),
  bounceIn: new Curve(bounceIn),
  bounceInOut: new Curve(bounceInOut),
  bounceOut: new Curve(bounceOut),
};
