type PriceAnchor = {
  close: number;
  month: number;
  year: number;
};

export type MonthlyCandleRow = {
  close: number;
  date: Date;
  high: number;
  low: number;
  open: number;
  volume: number;
};

export type DailyTimestampRow = {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
  volume: number;
};

const BTC_MONTHLY_ANCHORS: PriceAnchor[] = [
  { year: 2016, month: 0, close: 430 },
  { year: 2016, month: 11, close: 963 },
  { year: 2017, month: 11, close: 13880 },
  { year: 2018, month: 11, close: 3742 },
  { year: 2019, month: 5, close: 13016 },
  { year: 2019, month: 11, close: 7200 },
  { year: 2020, month: 11, close: 28993 },
  { year: 2021, month: 3, close: 57750 },
  { year: 2021, month: 10, close: 61299 },
  { year: 2022, month: 10, close: 17100 },
  { year: 2023, month: 11, close: 42258 },
  { year: 2024, month: 2, close: 71333 },
  { year: 2024, month: 5, close: 62000 },
];

function monthKey(year: number, month: number): number {
  return year * 12 + month;
}

function interpolate(start: number, end: number, ratio: number): number {
  return start + (end - start) * ratio;
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

export function buildBitcoinMonthlyRows(): MonthlyCandleRow[] {
  const rows: MonthlyCandleRow[] = [];
  let previousClose = BTC_MONTHLY_ANCHORS[0].close * 0.94;
  let index = 0;

  for (let anchorIndex = 0; anchorIndex < BTC_MONTHLY_ANCHORS.length - 1; anchorIndex += 1) {
    const start = BTC_MONTHLY_ANCHORS[anchorIndex];
    const end = BTC_MONTHLY_ANCHORS[anchorIndex + 1];
    const startKey = monthKey(start.year, start.month);
    const endKey = monthKey(end.year, end.month);
    const span = endKey - startKey;

    for (let currentKey = startKey; currentKey < endKey; currentKey += 1) {
      const offset = currentKey - startKey;
      const ratio = span === 0 ? 0 : offset / span;
      const closeBase = interpolate(start.close, end.close, ratio);
      const wave = Math.sin(index * 0.85) * 0.065 + Math.cos(index * 0.31) * 0.025;
      const close = Math.max(120, closeBase * (1 + wave * 0.28));
      const open = previousClose;
      const volatility = 0.05 + Math.abs(Math.sin(index * 1.17)) * 0.11;
      const high = Math.max(open, close) * (1 + volatility * 0.55);
      const low = Math.max(50, Math.min(open, close) * (1 - volatility * 0.45));
      const year = Math.floor(currentKey / 12);
      const month = currentKey % 12;

      rows.push({
        date: utcDate(year, month, 1),
        open,
        high,
        low,
        close,
        volume: Math.round(60_000_000 + close * 3_500 + index * 250_000),
      });

      previousClose = close;
      index += 1;
    }
  }

  const lastAnchor = BTC_MONTHLY_ANCHORS[BTC_MONTHLY_ANCHORS.length - 1];
  rows.push({
    date: utcDate(lastAnchor.year, lastAnchor.month, 1),
    open: previousClose,
    high: Math.max(previousClose, lastAnchor.close) * 1.08,
    low: Math.min(previousClose, lastAnchor.close) * 0.92,
    close: lastAnchor.close,
    volume: Math.round(95_000_000 + lastAnchor.close * 2_800),
  });

  return rows;
}

export function buildBitcoinDailyTimestampRows(): DailyTimestampRow[] {
  const rows: DailyTimestampRow[] = [];
  const start = utcDate(2024, 0, 1);
  let previousClose = 42_300;

  for (let index = 0; index < 180; index += 1) {
    const timestamp = start.getTime() + index * 24 * 60 * 60 * 1000;
    const trend =
      index < 75
        ? interpolate(42_300, 70_800, index / 75)
        : index < 120
          ? interpolate(70_800, 59_400, (index - 75) / 45)
          : interpolate(59_400, 67_800, (index - 120) / 60);
    const wave = Math.sin(index * 0.44) * 0.04 + Math.cos(index * 0.18) * 0.02;
    const close = Math.max(10_000, trend * (1 + wave));
    const open = previousClose;
    const volatility = 0.018 + Math.abs(Math.sin(index * 0.93)) * 0.038;
    const high = Math.max(open, close) * (1 + volatility);
    const low = Math.min(open, close) * (1 - volatility * 0.92);

    rows.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: Math.round(18_000_000 + close * 1_400 + index * 35_000),
    });

    previousClose = close;
  }

  return rows;
}

export const bitcoinMonthlyRows = buildBitcoinMonthlyRows();
export const bitcoinDailyTimestampRows = buildBitcoinDailyTimestampRows();
