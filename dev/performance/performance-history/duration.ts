type TraceHistory = {
	timestamp: number;
	runApp: number;
	mount: number;
	draw: number;
	layout: number;
	paintTransform?: number;
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
histories.push({"timestamp":1775915369686,"runApp":33.951,"mount":9.3387,"draw":24.305500000000002,"layout":18.006700000000002,"paint":2.1998,"note":"Text layout improvement PR #134 applied"});
histories.push({"timestamp":1775917885411,"runApp":34.025099999999995,"mount":9.476,"draw":24.2177,"layout":17.768500000000003,"paint":2.0959,"note":"Canvas repaint boundary + layer optimizations (OffsetLayer/OpacityLayer skip, flushPaint guard)"});
histories.push({"timestamp":1775964596017,"runApp":35.105599999999995,"mount":9.9202,"draw":24.864299999999997,"layout":18.065199999999997,"paint":2.3900999999999994,"note":"Issue #31 lazy element deactivation / GlobalKey reparenting PR #135"});
histories.push({"timestamp":1775966196051,"runApp":10.3255,"mount":9.7897,"draw":0.4593999999999999,"layout":0.4353000000000001,"paint":0.6648999999999999,"note":"Issue #125 relayout boundaries + sizedByParent + dry/intrinsic cache"});
histories.push({"timestamp":1775980210769,"runApp":4.2697,"mount":7.9485,"draw":0.389,"layout":0.3646,"paintTransform":0,"paint":0.6706,"note":"Issue #125 relayout boundaries + phase markers"});
histories.push({"timestamp":1775998306391,"runApp":0.1018,"mount":2.9842,"draw":7.2894000000000005,"layout":5.2943,"paintTransform":0,"paint":0.7060000000000001,"note":"Issue #132 intrinsic recursion fix"});
