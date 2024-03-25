import {
	type Widget,
	Container,
	Column,
	MainAxisSize,
	Row,
	EdgeInsets,
	CrossAxisAlignment,
	MainAxisAlignment,
	StatefulWidget,
	State,
	Element,
	SizedBox,
	Size,
	GlobalKey
} from '@meursyphus/flitter';
import InitialNode from './InitialNode';
import { classToFunction } from '../utils';
import type { Table } from '../../type';
import DiagramControllerProvider from '../Provider/DiagramControllerProvider';
import type { DiagramController } from '../../controller';

class InitialNodes extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new InitialNodesState();
	}
}

type TableName = string;

type ResolveTable =
	| {
			type: 'initial';
			table: Table;
	  }
	| {
			type: 'legacy';
			size: Size;
	  };

class InitialNodesState extends State<InitialNodes> {
	legacyNodes: Record<TableName, { size: Size; index: number }> = {};
	controller!: DiagramController;
	initState(context: Element): void {
		this.controller = DiagramControllerProvider.of(context);
	}

	getResolveTables(): ResolveTable[] {
		const tables: ResolveTable[] = this.controller
			.getAllTables()
			.filter(({ name }) => !this.isLegacyTable(name))
			.map((table) => ({ type: 'initial', table }));

		Object.values(this.legacyNodes)
			.sort((a, b) => a.index - b.index)
			.forEach((legacyNode) => {
				tables.splice(legacyNode.index, 0, { type: 'legacy', size: legacyNode.size });
			});

		return tables;
	}

	isLegacyTable(tableName: string) {
		return this.legacyNodes[tableName] != null;
	}

	handleLegacyNode =
		({ index, tableName }: { index: number; tableName: string }) =>
		(key: GlobalKey) => {
			this.element.scheduler.addPostFrameCallbacks(() => {
				this.setState(() => {
					this.legacyNodes[tableName] = {
						index,
						size: key.currentContext.renderObject.size
					};
				});
			});
		};

	override build() {
		const tables = this.getResolveTables();
		return Masonry({
			children: tables.map((table, index) =>
				table.type === 'legacy'
					? SizedBox({ width: table.size.width, height: table.size.height })
					: InitialNode({
							table: table.table,
							onLegacy: this.handleLegacyNode({ index, tableName: table.table.name })
						})
			),
			columnCount: 4,
			crossAxisSpacing: 60,
			verticalSpacing: 48
		});
	}
}

export default classToFunction(InitialNodes);

function Masonry({
	children,
	columnCount = 4,
	verticalSpacing = 40,
	crossAxisSpacing = 40
}: {
	children: Widget[];
	columnCount?: number;
	verticalSpacing?: number;
	crossAxisSpacing?: number;
}) {
	return Row({
		mainAxisSize: MainAxisSize.min,
		crossAxisAlignment: CrossAxisAlignment.start,
		mainAxisAlignment: MainAxisAlignment.start,
		children: Array.from({ length: columnCount }).map((_, index) =>
			Container({
				padding: EdgeInsets.only({ left: index === 0 ? 0 : crossAxisSpacing }),
				child: Column({
					crossAxisAlignment: CrossAxisAlignment.start,
					mainAxisSize: MainAxisSize.min,
					children: children
						.filter((_, childIndex) => childIndex % columnCount === index)
						.map((child) =>
							Container({
								padding: EdgeInsets.only({ bottom: verticalSpacing }),
								child
							})
						)
				})
			})
		)
	});
}
