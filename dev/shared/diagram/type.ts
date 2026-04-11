import type {
	Project as _Project,
	Table as _Table,
	Field as _Field,
	Ref as _Ref,
	Endpoint as _Endpoint
} from '$lib/dbml';

export type Project = Pick<_Project, 'id' | 'note' | 'schemas' | 'databaseType' | 'name'>;
export type Table = _Table;
export type Field = _Field;
export type Ref = _Ref;
export type Endpoint = _Endpoint;
export type RelatedField<FieldId extends number = number> = {
	from: { id: FieldId; relation: '*' | '1' };
	to: { id: FieldId; relation: '*' | '1' };
};
export type Relation = '*' | '1';
export type FieldId = number;
export type TableName = string;
export type TableId = number;
