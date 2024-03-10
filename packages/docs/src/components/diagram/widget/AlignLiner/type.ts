export type Line =
	| {
			type: 'vertical';
			x: number;
	  }
	| {
			type: 'horizontal';
			y: number;
	  };
