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
