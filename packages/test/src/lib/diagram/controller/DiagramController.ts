import { GlobalKey, Offset, Rect } from '@meursyphus/flitter';
import type { Project, Ref, RelatedField, Relation, Table } from '../type';

type TableName = string;

type RelatedFieldByTableId<
	TABLE_ID extends number = number,
	FIELD_ID extends number = number
> = Record<TABLE_ID, { from: FIELD_ID; to: FIELD_ID }[]>;

class DiagramController {
	readonly diagramRootGlobalKey: GlobalKey = new GlobalKey();
	#relatedFieldIdsOnTableId: RelatedFieldByTableId = {};
	#relatedFields: RelatedField[] = [];
	#tables: Table[] = [];
	#tableMap: Record<TableName, Table> = {};
	#scale = 1;

	#activeDraggingTableName: string | null = null;
	setActiveDragging(tableName: string | null) {
		this.#activeDraggingTableName = tableName;
	}
	get isDragging() {
		return this.#activeDraggingTableName != null;
	}
	isDraggingTarget(tableName: string) {
		return this.#activeDraggingTableName === tableName;
	}

	getRect(key: GlobalKey): Rect {
		const offset = this.getGlobalOffset(key);
		const size = this.getSize(key);

		return Rect.fromLTWH({
			left: offset.x,
			top: offset.y,
			width: size.width,
			height: size.height
		});
	}

	getCanvasRect(): Rect {
		const size = this.getSize(this.diagramRootGlobalKey);

		return Rect.fromLTWH({
			left: 0,
			top: 0,
			width: size.width,
			height: size.height
		});
	}

	getTranslation(translation: Offset) {
		return translation.multiply(1 / this.#scale);
	}

	getTableByName(name: string): Table | null {
		return this.#tableMap[name] ?? null;
	}

	changeScale(scale: number) {
		this.#scale = scale;
	}

	getScale() {
		return this.#scale;
	}

	#rect: Rect = Rect.fromLTRB({ left: 0, top: 0, right: 0, bottom: 0 });
	changeRootRect({
		left,
		top,
		width,
		height
	}: {
		left: number;
		top: number;
		width: number;
		height: number;
	}) {
		this.#rect = Rect.fromLTWH({ left, top, width, height });
	}

	getRootRect() {
		return this.#rect;
	}

	updateProject(project: Project) {
		const { schemas } = project;
		const tables = schemas.map((schema) => schema.tables).flat();
		const refs = schemas.map((schema) => schema.refs).flat();
		const { relatedFieldIdsOnTableId, relatedFields } = this.resolveTableAndRefs({ tables, refs });

		this.#relatedFields = relatedFields;
		this.#relatedFieldIdsOnTableId = relatedFieldIdsOnTableId;
		this.#tables = tables;
		this.#tableMap = tables.reduce(
			(acc, table) => {
				acc[table.name] = table;
				return acc;
			},
			{} as Record<TableName, Table>
		);
	}

	getAllTables(): Table[] {
		return this.#tables;
	}

	getAllRelatedFields(): RelatedField[] {
		return this.#relatedFields;
	}

	getRelatedFieldIdsByTableId(tableId: number): RelatedFieldByTableId[number] {
		return this.#relatedFieldIdsOnTableId[tableId] ?? {};
	}

	private resolveTableAndRefs({ tables, refs }: { tables: Table[]; refs: Ref[] }) {
		const endpointToField = tables
			.map((table) => table.fields.map((field) => ({ ...field, tableId: table.id })))
			.flat()
			.map((field) =>
				field.endpoints.map((endpoint) => ({
					...endpoint,
					fieldId: field.id,
					tableId: field.tableId
				}))
			)
			.flat()
			.reduce(
				(acc, endpoint) => {
					acc[endpoint.id] = {
						fieldId: endpoint.fieldId,
						relation: endpoint.relation,
						tableId: endpoint.tableId
					};
					return acc;
				},
				{} as Record<number, { fieldId: number; relation: Relation; tableId: number }>
			);

		const relatedFieldIdsOnTableId: RelatedFieldByTableId = tables.reduce((acc, table) => {
			acc[table.id] = [];
			return acc;
		}, {} as RelatedFieldByTableId);
		const relatedFields: RelatedField[] = [];

		refs.forEach((ref) => {
			const [from, to] = ref.endpointIds.map((id) => endpointToField[id]);
			relatedFieldIdsOnTableId[from.tableId].push({ from: from.fieldId, to: to.fieldId });
			relatedFieldIdsOnTableId[to.tableId].push({ from: from.fieldId, to: to.fieldId });

			relatedFields.push({
				from: {
					id: from.fieldId,
					relation: from.relation
				},
				to: {
					id: to.fieldId,
					relation: to.relation
				}
			});
		});

		return {
			relatedFields,
			relatedFieldIdsOnTableId
		};
	}

	private getGlobalOffset(globalKey: GlobalKey) {
		return globalKey.currentContext.renderObject.localToGlobal();
	}

	private getSize(globalKey: GlobalKey) {
		return globalKey.currentContext.renderObject.size;
	}
}

export default DiagramController;
