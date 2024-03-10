import { Offset, Path, Rect } from '@moonmoonbrothers/flutterjs';

const RELATION_LENGTH = 10;

type Relation = '*' | '1';

type Vertex = {
	rect: Rect;
	relation: Relation;
};

function drawEdge({
	path,
	fromField,
	toField
}: {
	fromField: Vertex;
	toField: Vertex;
	path: Path;
}) {
	const overlapped = checkOverlap(fromField.rect, toField.rect);

	const { from, corner1, corner2, to } = overlapped
		? getDotsOnOverlapped({ fromField, toField })
		: getDotsNotOverlapped({ fromField, toField });

	path
		.moveTo(from)
		.lineTo(corner1)
		.moveTo(corner1)
		.lineTo(corner2)
		.moveTo(corner2)
		.lineTo(to)
		.close();

	drawRelation({
		position: from,
		relation: fromField.relation,
		direction: from.x > corner1.x ? 'left' : 'right',
		path
	});
	drawRelation({
		position: to,
		relation: toField.relation,
		direction: to.x > corner2.x ? 'left' : 'right',
		path
	});
}

export default drawEdge;

function checkOverlap(from: Rect, to: Rect) {
	return !(
		to.right + 2 * RELATION_LENGTH < from.left || from.right + 2 * RELATION_LENGTH < to.left
	);
}

function getDotsOnOverlapped({ fromField, toField }: { fromField: Vertex; toField: Vertex }) {
	const connectedSide: 'left' | 'right' =
		Math.abs(fromField.rect.left - toField.rect.left) <
		Math.abs(fromField.rect.right - toField.rect.right)
			? 'left'
			: 'right';

	const from = new Offset({
		x: connectedSide === 'left' ? fromField.rect.left : fromField.rect.right,
		y: fromField.rect.center.y
	});

	const to = new Offset({
		x: connectedSide == 'left' ? toField.rect.left : toField.rect.right,
		y: toField.rect.center.y
	});

	const distance = RELATION_LENGTH + 4;

	const cornerX =
		connectedSide === 'left'
			? (from.x < to.x ? from.x : to.x) - distance
			: (from.x > to.x ? from.x : to.x) + distance;

	const corner1 = new Offset({ x: cornerX, y: from.y });
	const corner2 = new Offset({ x: cornerX, y: to.y });

	return {
		from,
		to,
		corner1,
		corner2
	};
}

function getDotsNotOverlapped({ fromField, toField }: { fromField: Vertex; toField: Vertex }) {
	const from = new Offset({
		x: fromField.rect.right < toField.rect.left ? fromField.rect.right : fromField.rect.left,
		y: fromField.rect.center.y
	});
	const to = new Offset({
		x: fromField.rect.right < toField.rect.left ? toField.rect.left : toField.rect.right,
		y: toField.rect.center.y
	});

	const corner1 = new Offset({ x: (from.x + to.x) / 2, y: from.y });
	const corner2 = new Offset({ x: (to.x + from.x) / 2, y: to.y });

	return {
		from,
		to,
		corner1,
		corner2
	};
}

function drawRelation({
	position,
	relation,
	direction,
	path
}: {
	position: Offset;
	relation: Relation;
	direction: 'right' | 'left';
	path: Path;
}) {
	if (relation === '*') {
		drawMultiRelation({ position, direction, path });
	} else {
		drawSingleRelation({ position, direction, path });
	}
}

function drawMultiRelation({
	position,
	direction,
	path
}: {
	position: Offset;
	direction: 'right' | 'left';
	path: Path;
}) {
	const to = new Offset({
		x: position.x + (direction === 'right' ? 1 : -1) * RELATION_LENGTH,
		y: position.y
	});

	path
		.moveTo(new Offset({ x: position.x, y: position.y - RELATION_LENGTH / 2 }))
		.lineTo(to)
		.moveTo(new Offset({ x: position.x, y: position.y + RELATION_LENGTH / 2 }))
		.lineTo(to)
		.close();
}

function drawSingleRelation({
	position,
	direction,
	path
}: {
	position: Offset;
	direction: 'right' | 'left';
	path: Path;
}) {
	const x = position.x + (direction === 'right' ? 1 : -1) * RELATION_LENGTH;

	path
		.moveTo(new Offset({ x, y: position.y - RELATION_LENGTH / 2 }))
		.lineTo(new Offset({ x, y: position.y + RELATION_LENGTH / 2 }))
		.close();
}
