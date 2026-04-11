import type {
	CandlestickChartCandle,
	CandlestickChartData,
	CandlestickChartGrouping,
	CandlestickChartTick,
	CandlestickChartTransform,
	CandlestickChartXValue,
	CandlestickChartXValueType,
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

type NormalizedXValue = {
	date: Date | null;
	sortValue: number | string;
	type: CandlestickChartXValueType;
	value: CandlestickChartXValue;
};

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function isNumericString(value: string): boolean {
	const trimmed = value.trim();
	return trimmed.length > 0 && Number.isFinite(Number(trimmed));
}

function isDateLikeString(value: string): boolean {
	const trimmed = value.trim();
	if (trimmed.length === 0) return false;
	if (!/[A-Za-z:/-]/.test(trimmed)) return false;
	return !Number.isNaN(Date.parse(trimmed));
}

function looksLikeUnixSeconds(value: number): boolean {
	return value >= 1_000_000_000 && value < 10_000_000_000;
}

function looksLikeUnixMilliseconds(value: number): boolean {
	return value >= 100_000_000_000 && value < 10_000_000_000_000;
}

function formatNumber(value: number): string {
	if (Number.isInteger(value)) return value.toLocaleString("en-US");
	return value.toLocaleString("en-US", {
		maximumFractionDigits: 2,
		minimumFractionDigits: Math.abs(value) >= 1 ? 0 : 2,
	});
}

function formatTooltipDate(date: Date): string {
	return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
}

function normalizeDateValue(raw: unknown): Date | null {
	if (raw instanceof Date) {
		return Number.isNaN(raw.getTime()) ? null : raw;
	}

	if (typeof raw === "number") {
		if (looksLikeUnixMilliseconds(raw)) return new Date(raw);
		if (looksLikeUnixSeconds(raw)) return new Date(raw * 1000);
		return null;
	}

	if (typeof raw === "string") {
		const time = Date.parse(raw);
		if (Number.isNaN(time)) return null;
		return new Date(time);
	}

	return null;
}

function resolveXValueType(
	raw: unknown,
	requestedType: CandlestickChartTransform["xValueType"] = "auto",
): CandlestickChartXValueType | null {
	if (requestedType != null && requestedType !== "auto") {
		return requestedType;
	}

	if (raw instanceof Date) return "date";

	if (typeof raw === "number") {
		return looksLikeUnixMilliseconds(raw) || looksLikeUnixSeconds(raw)
			? "date"
			: "number";
	}

	if (typeof raw === "string") {
		if (isDateLikeString(raw)) return "date";
		if (isNumericString(raw)) return "number";
		return "string";
	}

	return null;
}

function normalizeXValue(
	raw: unknown,
	transform: CandlestickChartTransform,
): NormalizedXValue | null {
	const type = resolveXValueType(raw, transform.xValueType);
	if (type == null) return null;

	if (type === "date") {
		const date = normalizeDateValue(raw);
		if (date == null) return null;
		return {
			type,
			date,
			value: date,
			sortValue: date.getTime(),
		};
	}

	if (type === "number") {
		const value =
			typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : null;
		if (value == null || !Number.isFinite(value)) return null;
		return {
			type,
			date: null,
			value,
			sortValue: value,
		};
	}

	if (typeof raw !== "string") return null;
	return {
		type,
		date: null,
		value: raw,
		sortValue: raw,
	};
}

function compareSortValue(
	left: CandlestickChartCandle & { rawIndex: number },
	right: CandlestickChartCandle & { rawIndex: number },
): number {
	if (typeof left.sortValue === "number" && typeof right.sortValue === "number") {
		return left.sortValue - right.sortValue || left.rawIndex - right.rawIndex;
	}

	return (
		String(left.sortValue).localeCompare(String(right.sortValue)) ||
		left.rawIndex - right.rawIndex
	);
}

function defaultShouldSort(
	xValueType: CandlestickChartXValueType,
	transform: CandlestickChartTransform,
): boolean {
	if (transform.sort != null) return transform.sort;
	return xValueType !== "string";
}

function selectEvenlySpacedIndices(length: number, targetCount: number): number[] {
	if (length <= 0) return [];
	if (length <= targetCount) return Array.from({ length }, (_, index) => index);
	if (targetCount <= 1) return [0];

	const result = new Set<number>();
	for (let slot = 0; slot < targetCount; slot += 1) {
		const ratio = targetCount === 1 ? 0 : slot / (targetCount - 1);
		result.add(Math.round(ratio * (length - 1)));
	}

	return Array.from(result).sort((left, right) => left - right);
}

function startOfUtcDay(date: Date): number {
	return Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
	);
}

function weekBucket(date: Date): number {
	return Math.floor(startOfUtcDay(date) / (7 * DAY_MS));
}

function quarter(date: Date): number {
	return Math.floor(date.getUTCMonth() / 3) + 1;
}

function formatDateTick(
	date: Date,
	mode: Exclude<CandlestickChartGrouping, "auto" | "value">,
	previousDate: Date | null,
): string {
	if (mode === "year") {
		return String(date.getUTCFullYear());
	}

	if (mode === "quarter") {
		return previousDate != null &&
			previousDate.getUTCFullYear() === date.getUTCFullYear()
			? `Q${quarter(date)}`
			: `Q${quarter(date)} ${date.getUTCFullYear()}`;
	}

	if (mode === "month") {
		const month = MONTH_NAMES[date.getUTCMonth()];
		return previousDate != null &&
			previousDate.getUTCFullYear() === date.getUTCFullYear()
			? month
			: `${month} ${date.getUTCFullYear()}`;
	}

	if (mode === "week") {
		const prefix =
			previousDate == null ||
			previousDate.getUTCMonth() !== date.getUTCMonth() ||
			previousDate.getUTCFullYear() !== date.getUTCFullYear()
				? `${MONTH_NAMES[date.getUTCMonth()]} `
				: "";
		return `${prefix}${date.getUTCDate()}`;
	}

	const prefix =
		previousDate == null ||
		previousDate.getUTCMonth() !== date.getUTCMonth() ||
		previousDate.getUTCFullYear() !== date.getUTCFullYear()
			? `${MONTH_NAMES[date.getUTCMonth()]} `
			: "";
	return `${prefix}${date.getUTCDate()}`;
}

function isBoundary(
	previousDate: Date | null,
	date: Date,
	mode: Exclude<CandlestickChartGrouping, "auto" | "value">,
): boolean {
	if (previousDate == null) return true;

	if (mode === "year") {
		return previousDate.getUTCFullYear() !== date.getUTCFullYear();
	}

	if (mode === "quarter") {
		return (
			previousDate.getUTCFullYear() !== date.getUTCFullYear() ||
			quarter(previousDate) !== quarter(date)
		);
	}

	if (mode === "month") {
		return (
			previousDate.getUTCFullYear() !== date.getUTCFullYear() ||
			previousDate.getUTCMonth() !== date.getUTCMonth()
		);
	}

	if (mode === "week") {
		return weekBucket(previousDate) !== weekBucket(date);
	}

	return startOfUtcDay(previousDate) !== startOfUtcDay(date);
}

function buildDateTicks(
	candles: CandlestickChartCandle[],
	mode: Exclude<CandlestickChartGrouping, "auto" | "value">,
): CandlestickChartTick[] {
	const ticks: CandlestickChartTick[] = [];
	let previousDate: Date | null = null;

	for (let index = 0; index < candles.length; index += 1) {
		const candle = candles[index];
		if (!(candle.x instanceof Date)) continue;
		if (!isBoundary(previousDate, candle.x, mode)) continue;

		ticks.push({
			index,
			label: formatDateTick(candle.x, mode, previousDate),
			value: candle.x,
		});
		previousDate = candle.x;
	}

	return ticks;
}

function thinTicks(
	ticks: CandlestickChartTick[],
	targetCount: number,
): CandlestickChartTick[] {
	if (ticks.length <= targetCount) return ticks;
	return selectEvenlySpacedIndices(ticks.length, targetCount).map(
		(index) => ticks[index],
	);
}

function getRegularStepCandidates(
	mode: Exclude<CandlestickChartGrouping, "auto" | "value">,
): number[] {
	switch (mode) {
		case "year":
			return [1, 2, 5, 10, 20, 50];
		case "quarter":
			return [1, 2, 4, 8, 12];
		case "month":
			return [1, 2, 3, 4, 6, 12, 24];
		case "week":
			return [1, 2, 4, 8, 13, 26, 52];
		case "day":
			return [1, 2, 5, 7, 10, 14, 30];
	}
}

function regularizeDateTicks(
	ticks: CandlestickChartTick[],
	mode: Exclude<CandlestickChartGrouping, "auto" | "value">,
	targetCount: number,
): CandlestickChartTick[] {
	if (ticks.length <= targetCount) return ticks;

	const steps = getRegularStepCandidates(mode);
	const bestStep = steps.reduce((winner, candidate) => {
		const winnerCount = Math.ceil(ticks.length / winner);
		const candidateCount = Math.ceil(ticks.length / candidate);
		const winnerDiff = Math.abs(winnerCount - targetCount);
		const candidateDiff = Math.abs(candidateCount - targetCount);

		if (candidateDiff < winnerDiff) return candidate;
		if (candidateDiff > winnerDiff) return winner;
		return candidate < winner ? candidate : winner;
	});

	return ticks.filter((_, index) => index % bestStep === 0);
}

function resolveTargetTickCount(
	width: number,
	candleCount: number,
	transform: CandlestickChartTransform,
): number {
	if (transform.tickCount != null && transform.tickCount > 0) {
		return Math.max(2, Math.floor(transform.tickCount));
	}

	if (candleCount <= 1) return candleCount;

	if (width <= 0) return Math.min(candleCount, 6);

	return Math.max(2, Math.min(candleCount, Math.floor(width / 96)));
}

function buildAutomaticDateTicks(
	candles: CandlestickChartCandle[],
	targetCount: number,
): CandlestickChartTick[] {
	const candidates = ([
		"year",
		"quarter",
		"month",
		"week",
		"day",
	] as const).map((mode) => ({
		mode,
		ticks: buildDateTicks(candles, mode),
	}));

	const best = candidates.reduce((winner, candidate) => {
		const winnerDiff = Math.abs(winner.ticks.length - targetCount);
		const candidateDiff = Math.abs(candidate.ticks.length - targetCount);

		if (candidateDiff < winnerDiff) return candidate;
		if (candidateDiff > winnerDiff) return winner;
		return candidate.ticks.length < winner.ticks.length ? candidate : winner;
	});

	return regularizeDateTicks(best.ticks, best.mode, targetCount);
}

function buildValueTicks(
	candles: CandlestickChartCandle[],
	targetCount: number,
): CandlestickChartTick[] {
	return selectEvenlySpacedIndices(candles.length, targetCount).map((index) => {
		const candle = candles[index];
		return {
			index,
			label:
				candle.x instanceof Date
					? formatTooltipDate(candle.x)
					: typeof candle.x === "number"
						? formatNumber(candle.x)
						: String(candle.x),
			value: candle.x,
		};
	});
}

export function normalizeCandles(
	data: CandlestickChartData,
	transform: CandlestickChartTransform,
): {
	candles: CandlestickChartCandle[];
	xValueType: CandlestickChartXValueType;
} {
	const normalized = data.rows.flatMap((row, rawIndex) => {
		const xRaw = row[data.xKey];
		const x = normalizeXValue(xRaw, transform);
		if (x == null) return [];
		if (
			!isFiniteNumber(row.open) ||
			!isFiniteNumber(row.high) ||
			!isFiniteNumber(row.low) ||
			!isFiniteNumber(row.close)
		) {
			return [];
		}

		const change = row.close - row.open;
		const changeRate =
			row.open === 0 ? null : change / row.open;

		return [
			{
				rawIndex,
				row,
				x: x.value,
				xType: x.type,
				label:
					x.date != null
						? formatTooltipDate(x.date)
						: typeof x.value === "number"
							? formatNumber(x.value)
							: String(x.value),
				open: row.open,
				high: row.high,
				low: row.low,
				close: row.close,
				isUp: row.close > row.open,
				isDown: row.close < row.open,
				isFlat: row.close === row.open,
				change,
				changeRate,
				sortValue: x.sortValue,
			},
		];
	});

	const xValueType = normalized[0]?.xType ?? "string";
	const candles = defaultShouldSort(xValueType, transform)
		? normalized.sort(compareSortValue)
		: normalized;

	return {
		xValueType,
		candles: candles.map(({ rawIndex: _rawIndex, ...candle }) => candle),
	};
}

export function createTicks(
	candles: CandlestickChartCandle[],
	xValueType: CandlestickChartXValueType,
	transform: CandlestickChartTransform,
	width: number,
): CandlestickChartTick[] {
	if (candles.length === 0) return [];

	const targetCount = resolveTargetTickCount(width, candles.length, transform);
	const groupBy = transform.groupBy ?? "auto";

	if (xValueType === "date") {
		if (groupBy === "auto") {
			return buildAutomaticDateTicks(candles, targetCount);
		}

		if (groupBy === "value") {
			return buildValueTicks(candles, targetCount);
		}

		return regularizeDateTicks(
			buildDateTicks(candles, groupBy),
			groupBy,
			targetCount,
		);
	}

	return buildValueTicks(candles, targetCount);
}
