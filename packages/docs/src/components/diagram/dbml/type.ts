interface Item {
	id: number;
	name: string;
	note: string;
}

export class Project implements Item {
	readonly id: number;
	readonly name: string;
	readonly databaseType: string;
	readonly note: string;
	readonly schemas: Schema[];
	constructor({
		id,
		name,
		note,
		databaseType,
		schemas
	}: {
		id: number;
		name?: string | null;
		databaseType?: string | null;
		note?: string | null;
		schemas: Schema[];
	}) {
		this.id = id;
		this.name = name ?? '';
		this.databaseType = databaseType ?? '';
		this.note = note ?? '';
		this.schemas = schemas;
	}

	findSchema(id: number): Schema | undefined {
		return this.schemas.find((schema) => schema.id === id);
	}

	findEnum(id: number): Enum | undefined {
		return this.schemas.flatMap((schema) => schema.enums).find((en) => en.id === id);
	}

	findGroup(id: number): Group | undefined {
		return this.schemas.flatMap((schema) => schema.groups).find((group) => group.id === id);
	}

	findTable(id: number): Table | undefined {
		return this.schemas.flatMap((schema) => schema.tables).find((table) => table.id === id);
	}

	findRef(id: number): Ref | undefined {
		return this.schemas.flatMap((schema) => schema.refs).find((ref) => ref.id === id);
	}
}

export interface Schema extends Item {
	enums: Enum[];
	groups: Group[];
	tables: Table[];
	refs: Ref[];
}

export interface Enum extends Item {
	values: string[];
}

type TokenInfo = {
	offset: number;
	line: number;
	column: number;
};

export type Token = {
	start: TokenInfo;
	end: TokenInfo;
};

export interface Group {
	id: number;
	name: string;
	tableIds: number[];
	token: Token;
}
export interface Table extends Item {
	meta: TableMeta;
	fields: Field[];
	indexes: Index[];
	token: Token;
}

export interface TableMeta {
	headerColor?: string;
}

export interface Index extends Item {
	unique: boolean;
	pk: string;
	columns: IndexColumn[];
	token: Token;
}

export interface IndexColumn {
	id: number;
	type: 'column';
	value: string;
}

export interface Field extends Item {
	type: FieldType;
	pk: boolean;
	notNull: boolean;
	increment: boolean;
	endpoints: Endpoint[];
	token: Token;
	default?: string | number;
}

export interface FieldType {
	args: unknown;
	schemaName: string;
	typeName: string;
}

export type Relation = '*' | '1';

export interface Endpoint {
	id: number;
	relation: Relation;
	tableName: string;
	fieldNames: string[];
	refId: number;
	token: Token;
}

export interface Ref {
	id: number;
	name: string;
	endpointIds: number[];
	token: Token;
}
