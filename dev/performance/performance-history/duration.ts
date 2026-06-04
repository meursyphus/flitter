type TraceHistory = {
	timestamp: number;
	runApp: number;
	mount: number;
	draw: number;
	layout: number;
	paint: number;
	note?: string;
};
export const histories: TraceHistory[] = [];
histories.push({
	timestamp: 1711290939603,
	runApp: 139.3087,
	mount: 112.6292,
	draw: 24.712700000000005,
	layout: 16.120700000000003,
	paint: 6.1294,
	note: 'requestAnimationFrame is called repeatedly'
});
histories.push({
	timestamp: 1711290939604,
	runApp: 138.3087,
	mount: 112.6292,
	draw: 24.712700000000005,
	layout: 16.120700000000003,
	paint: 6.1294,
	note: 'requestAnimationFrame is called repeatedly'
});
histories.push({
	timestamp: 1711549339035,
	runApp: 42.958600000000004,
	mount: 17.3004,
	draw: 24.5248,
	layout: 16.3164,
	paint: 5.675
});
histories.push({
	timestamp: 1711549353199,
	runApp: 43.0836,
	mount: 17.142,
	draw: 24.7666,
	layout: 16.708199999999998,
	paint: 5.6998
});
histories.push({
	timestamp: 1711550408148,
	runApp: 42.6001,
	mount: 17,
	draw: 24.491599999999995,
	layout: 16.9666,
	paint: 5.304,
	note: ''
});
histories.push({
	timestamp: 1714310611279,
	runApp: 41.3832,
	mount: 17.403799999999997,
	draw: 22.854300000000002,
	layout: 15.2668,
	paint: 5.3334,
	note: ''
});
histories.push({
	timestamp: 1714359575439,
	runApp: 39.6455,
	mount: 16.907999999999998,
	draw: 21.6917,
	layout: 14.249800000000002,
	paint: 5.2085,
	note: ''
});
histories.push({
	timestamp: 1715308087552,
	runApp: 46.0328,
	mount: 17.316300000000002,
	draw: 27.8372,
	layout: 15.483399999999998,
	paint: 5.354,
	note: ''
});
histories.push({
	timestamp: 1715338831676,
	runApp: 45.54619999999999,
	mount: 14.171,
	draw: 30.554499999999997,
	layout: 14.7544,
	paint: 9.0127,
	note: ''
});
histories.push({
	timestamp: 1715338879746,
	runApp: 45.550000000000004,
	mount: 13.9085,
	draw: 30.7249,
	layout: 14.824799999999998,
	paint: 8.975,
	note: ''
});
histories.push({
	timestamp: 1715419699694,
	runApp: 43.7164,
	mount: 13.479200000000002,
	draw: 29.349899999999998,
	layout: 14.345400000000001,
	paint: 6.0251,
	note: ''
});
histories.push({
	timestamp: 1715429733090,
	runApp: 48.37930000000001,
	mount: 15.283299999999999,
	draw: 32.2541,
	layout: 15.5791,
	paint: 6.7456000000000005,
	note: ''
});
histories.push({
	timestamp: 1715429770733,
	runApp: 47.924600000000005,
	mount: 14.9539,
	draw: 32.041700000000006,
	layout: 15.558500000000002,
	paint: 6.3291,
	note: ''
});
histories.push({
	timestamp: 1715601913087,
	runApp: 45.1918,
	mount: 14.137799999999999,
	draw: 30.258,
	layout: 14.933300000000001,
	paint: 5.9915,
	note: ''
});
histories.push({
	timestamp: 1715750895627,
	runApp: 44.879099999999994,
	mount: 14.116399999999999,
	draw: 29.8918,
	layout: 13.9833,
	paint: 5.779399999999999,
	note: ''
});
histories.push({
	timestamp: 1776256475274,
	runApp: 25.2975,
	mount: 9.7043,
	draw: 15.2455,
	layout: 8.908,
	paint: 2.8495999999999997,
	note: ''
});
histories.push({
	timestamp: 1776260114307,
	runApp: 25.626099999999997,
	mount: 9.8765,
	draw: 15.396699999999997,
	layout: 9.113700000000001,
	paint: 2.8064999999999998,
	note:
		'Issue #132: added dry layout/getDryLayout cache and sizedByParent/performResize, implemented dry layout for Padding/Align/ConstrainedBox/Flex, fixed Constraints.isTight, and removed hardcoded Tooltip type hashes in sync-bundled-types.'
});
histories.push({"timestamp":1776262912000,"runApp":26.824699999999993,"mount":10.8068,"draw":15.6527,"layout":9.165000000000001,"paint":2.8459,"note":"Issue #126 build phase optimization"});
histories.push({"timestamp":1776295443943,"runApp":25.8947,"mount":10.187299999999999,"draw":15.370899999999999,"layout":9.5963,"paint":2.4985999999999997,"note":"Issue #125 relayout boundary follow-up"});
histories.push({"timestamp":1776295997841,"runApp":26.3901,"mount":10.3033,"draw":15.738,"layout":9.6742,"paint":2.5785,"note":"Issue #127 and #141 compositing + tooltip import"});
histories.push({"timestamp":1780573352961,"runApp":30.0647,"mount":11.5334,"draw":18.093400000000003,"layout":10.894200000000001,"paint":3.0589000000000004,"note":"BASELINE same-machine (pre-optimization, branch perf/flutter-aligned-core)"});
histories.push({"timestamp":1780573688525,"runApp":31.945499999999996,"mount":12.202399999999999,"draw":19.3119,"layout":12.209399999999999,"paint":3.0416999999999996,"note":"OPT-1: structure-epoch cached render children (RenderObject.children memoized; no per-access element-tree walk/alloc)"});
histories.push({"timestamp":1780574091711,"runApp":28.872599999999995,"mount":11.031400000000001,"draw":17.4294,"layout":10.041,"paint":2.9335,"note":"AB optimized run1 (children-cache + single-child visit + frozen consts + collectPaintItems stack)"});
histories.push({"timestamp":1780574102452,"runApp":29.3248,"mount":11.1438,"draw":17.7646,"layout":10.3184,"paint":2.9925,"note":"AB optimized run2"});
histories.push({"timestamp":1780574113085,"runApp":29.7977,"mount":11.5093,"draw":17.8718,"layout":10.8932,"paint":3.0261,"note":"AB baseline run1 (original latest code)"});
histories.push({"timestamp":1780574123965,"runApp":29.6331,"mount":11.4666,"draw":17.765900000000002,"layout":10.8879,"paint":2.9738,"note":"AB baseline run2"});
histories.push({"timestamp":1780574939065,"runApp":28.7756,"mount":11.0178,"draw":17.358400000000003,"layout":10.6717,"paint":2.8547999999999996,"note":"OPT batch + text caches (children-cache, single-child visit, frozen consts, collectPaintItems stack, TextPainter layout cache, getTextWidth flyweight)"});
histories.push({"timestamp":1780575254503,"runApp":28.950100000000003,"mount":11.1741,"draw":17.357400000000002,"layout":10.389999999999999,"paint":2.8150000000000004,"note":"FINAL all-optimizations confirm run"});
histories.push({"timestamp":1780576555368,"runApp":28.214499999999997,"mount":10.9437,"draw":16.889200000000002,"layout":10.550699999999999,"paint":2.7582999999999998,"note":"AGGRESSIVE: canvas lazy paintTransform + matrix4 fastpath + numeric cache keys (on top of structural+text caches)"});
