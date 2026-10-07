import { ClipRect, Container, Rect, RepaintBoundary, State, StatefulWidget } from 'flitter-core';

class ClipToggleScene extends StatefulWidget {
	constructor(
		readonly boundary: boolean,
		readonly nested: boolean,
		readonly clipped: boolean,
		readonly ready: (state: ClipToggleState) => void
	) {
		super();
	}
	createState() {
		return new ClipToggleState();
	}
}

export function createClipToggleScene(...args: ConstructorParameters<typeof ClipToggleScene>) {
	return new ClipToggleScene(...args);
}

export class ClipToggleState extends State<ClipToggleScene> {
	clipped = true;
	counts = { mounts: 0, disposals: 0, clips: 0 };
	private child!: CountingChild;
	private clipper = () => {
		this.counts.clips++;
		return Rect.fromLTWH({ left: 0, top: 0, width: 40, height: 40 });
	};

	initState() {
		this.clipped = this.widget.clipped;
		this.child = new CountingChild(this.counts);
		this.widget.ready(this);
	}
	setClipped(clipped: boolean) {
		this.setState(() => {
			this.clipped = clipped;
		});
	}
	build() {
		const child = this.widget.boundary ? RepaintBoundary({ child: this.child }) : this.child;
		const clip = ClipRect({ clipped: this.clipped, clipper: this.clipper, child });
		return this.widget.nested
			? ClipRect({
					clipper: () => Rect.fromLTWH({ left: 0, top: 0, width: 60, height: 60 }),
					child: clip
				})
			: clip;
	}
}

class CountingChild extends StatefulWidget {
	constructor(readonly counts: ClipToggleState['counts']) {
		super();
	}
	createState() {
		return new CountingChildState();
	}
}

class CountingChildState extends State<CountingChild> {
	initState() {
		this.widget.counts.mounts++;
	}
	dispose() {
		this.widget.counts.disposals++;
	}
	build() {
		return Container({ width: 80, height: 80, color: '#ff0000' });
	}
}
