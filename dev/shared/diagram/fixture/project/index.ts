import type { Project } from './type';

const data: Project = {
	id: 1,
	name: '',
	databaseType: '',
	note: '',
	schemas: [
		{
			id: 1,
			name: 'public',
			note: 'Default Public Schema',
			enums: [
				{
					id: 1,
					name: 'refresh_queue_sourece_type',
					note: '',
					values: ['NONE', 'SPACE', 'META', 'POST']
				},
				{ id: 2, name: 'refresh_queue_type', note: '', values: ['NONE', 'META', 'POST'] },
				{
					id: 3,
					name: 'refresh_queue_state',
					note: '',
					values: ['NONE', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELED', 'TERMINATED']
				},
				{
					id: 4,
					name: 'space_message_check_state',
					note: '',
					values: ['NONE', 'UNVIEWED', 'VIEWED']
				},
				{ id: 5, name: 'space_message_state', note: '', values: ['NONE', 'DELETED'] }
			],
			groups: [
				{
					id: 1,
					name: 'blog',
					tableIds: [1, 2, 3, 4, 5, 6, 7],
					token: {
						start: { offset: 11, line: 4, column: 1 },
						end: { offset: 115, line: 12, column: 2 }
					}
				},
				{
					id: 2,
					name: 'member',
					tableIds: [8],
					token: {
						start: { offset: 1663, line: 117, column: 1 },
						end: { offset: 1693, line: 119, column: 2 }
					}
				}
			],
			tables: [
				{
					id: 1,
					name: 'space',
					note: '',
					fields: [
						{
							id: 1,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [
								{
									id: 1,
									relation: '1',
									tableName: 'space',
									fieldNames: ['id'],
									refId: 1,
									token: {
										start: { offset: 404, line: 28, column: 18 },
										end: { offset: 419, line: 28, column: 33 }
									}
								},
								{
									id: 5,
									relation: '1',
									tableName: 'space',
									fieldNames: ['id'],
									refId: 3,
									token: {
										start: { offset: 716, line: 46, column: 18 },
										end: { offset: 731, line: 46, column: 33 }
									}
								},
								{
									id: 9,
									relation: '1',
									tableName: 'space',
									fieldNames: ['id'],
									refId: 5,
									token: {
										start: { offset: 917, line: 59, column: 18 },
										end: { offset: 932, line: 59, column: 33 }
									}
								},
								{
									id: 11,
									relation: '1',
									tableName: 'space',
									fieldNames: ['id'],
									refId: 6,
									token: {
										start: { offset: 1375, line: 94, column: 18 },
										end: { offset: 1390, line: 94, column: 33 }
									}
								}
							],
							token: {
								start: { offset: 133, line: 15, column: 3 },
								end: { offset: 146, line: 16, column: 1 }
							}
						},
						{
							id: 2,
							name: 'uid',
							note: '',
							type: { args: '36', schemaName: '', typeName: 'varchar(36)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 146, line: 16, column: 1 },
								end: { offset: 164, line: 17, column: 1 }
							}
						},
						{
							id: 3,
							name: 'slug',
							note: '',
							type: { args: '20', schemaName: '', typeName: 'varchar(20)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 164, line: 17, column: 1 },
								end: { offset: 192, line: 18, column: 1 }
							}
						},
						{
							id: 4,
							name: 'database_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 192, line: 18, column: 1 },
								end: { offset: 233, line: 19, column: 1 }
							}
						},
						{
							id: 5,
							name: 'title',
							note: '',
							type: { args: '40', schemaName: '', typeName: 'varchar(40)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 233, line: 19, column: 1 },
								end: { offset: 253, line: 20, column: 1 }
							}
						},
						{
							id: 6,
							name: 'state',
							note: '',
							type: { args: null, schemaName: '', typeName: 'byte' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 13,
									relation: '1',
									tableName: 'space',
									fieldNames: ['state'],
									refId: 7,
									token: {
										start: { offset: 1820, line: 130, column: 1 },
										end: { offset: 1863, line: 130, column: 44 }
									}
								}
							],
							token: {
								start: { offset: 253, line: 20, column: 1 },
								end: { offset: 266, line: 21, column: 1 }
							}
						},
						{
							id: 7,
							name: 'created_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 266, line: 21, column: 1 },
								end: { offset: 288, line: 22, column: 1 }
							}
						},
						{
							id: 8,
							name: 'updated_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 14,
									relation: '*',
									tableName: 'space',
									fieldNames: ['updated_at'],
									refId: 7,
									token: {
										start: { offset: 1820, line: 130, column: 1 },
										end: { offset: 1863, line: 130, column: 44 }
									}
								}
							],
							token: {
								start: { offset: 288, line: 22, column: 1 },
								end: { offset: 310, line: 23, column: 1 }
							}
						},
						{
							id: 9,
							name: 'last_refresed_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 310, line: 23, column: 1 },
								end: { offset: 338, line: 24, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 117, line: 14, column: 1 },
						end: { offset: 339, line: 24, column: 2 }
					}
				},
				{
					id: 2,
					name: 'post',
					note: '',
					fields: [
						{
							id: 10,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [
								{
									id: 3,
									relation: '1',
									tableName: 'post',
									fieldNames: ['id'],
									refId: 2,
									token: {
										start: { offset: 621, line: 40, column: 17 },
										end: { offset: 635, line: 40, column: 31 }
									}
								}
							],
							token: {
								start: { offset: 356, line: 27, column: 3 },
								end: { offset: 387, line: 28, column: 1 }
							}
						},
						{
							id: 11,
							name: 'space_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 2,
									relation: '*',
									tableName: 'post',
									fieldNames: ['space_id'],
									refId: 1,
									token: {
										start: { offset: 404, line: 28, column: 18 },
										end: { offset: 419, line: 28, column: 33 }
									}
								}
							],
							token: {
								start: { offset: 387, line: 28, column: 1 },
								end: { offset: 421, line: 29, column: 1 }
							}
						},
						{
							id: 12,
							name: 'state',
							note: '',
							type: { args: null, schemaName: '', typeName: 'byte' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 421, line: 29, column: 1 },
								end: { offset: 434, line: 30, column: 1 }
							}
						},
						{
							id: 13,
							name: 'slug',
							note: '',
							type: { args: '200', schemaName: '', typeName: 'varchar(200)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 434, line: 30, column: 1 },
								end: { offset: 454, line: 31, column: 1 }
							}
						},
						{
							id: 14,
							name: 'title',
							note: '',
							type: { args: '200', schemaName: '', typeName: 'varchar(200)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 454, line: 31, column: 1 },
								end: { offset: 475, line: 32, column: 1 }
							}
						},
						{
							id: 15,
							name: 'tags',
							note: '',
							type: { args: '300', schemaName: '', typeName: 'varchar(300)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 475, line: 32, column: 1 },
								end: { offset: 495, line: 33, column: 1 }
							}
						},
						{
							id: 16,
							name: 'description',
							note: '',
							type: { args: '400', schemaName: '', typeName: 'varchar(400)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 495, line: 33, column: 1 },
								end: { offset: 522, line: 34, column: 1 }
							}
						},
						{
							id: 17,
							name: 'created_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 522, line: 34, column: 1 },
								end: { offset: 544, line: 35, column: 1 }
							}
						},
						{
							id: 18,
							name: 'updated_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 544, line: 35, column: 1 },
								end: { offset: 566, line: 36, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 341, line: 26, column: 1 },
						end: { offset: 567, line: 36, column: 2 }
					}
				},
				{
					id: 3,
					name: 'post_content',
					note: '',
					fields: [
						{
							id: 19,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [],
							token: {
								start: { offset: 592, line: 39, column: 3 },
								end: { offset: 605, line: 40, column: 1 }
							}
						},
						{
							id: 20,
							name: 'post_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 4,
									relation: '1',
									tableName: 'post_content',
									fieldNames: ['post_id'],
									refId: 2,
									token: {
										start: { offset: 621, line: 40, column: 17 },
										end: { offset: 635, line: 40, column: 31 }
									}
								}
							],
							token: {
								start: { offset: 605, line: 40, column: 1 },
								end: { offset: 637, line: 41, column: 1 }
							}
						},
						{
							id: 21,
							name: 'json',
							note: '',
							type: { args: null, schemaName: '', typeName: 'jsonb' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 637, line: 41, column: 1 },
								end: { offset: 650, line: 42, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 569, line: 38, column: 1 },
						end: { offset: 651, line: 42, column: 2 }
					}
				},
				{
					id: 4,
					name: 'meta',
					note: '',
					fields: [
						{
							id: 22,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [
								{
									id: 7,
									relation: '1',
									tableName: 'meta',
									fieldNames: ['id'],
									refId: 4,
									token: {
										start: { offset: 831, line: 53, column: 17 },
										end: { offset: 845, line: 53, column: 31 }
									}
								}
							],
							token: {
								start: { offset: 668, line: 45, column: 3 },
								end: { offset: 699, line: 46, column: 1 }
							}
						},
						{
							id: 23,
							name: 'space_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 6,
									relation: '*',
									tableName: 'meta',
									fieldNames: ['space_id'],
									refId: 3,
									token: {
										start: { offset: 716, line: 46, column: 18 },
										end: { offset: 731, line: 46, column: 33 }
									}
								}
							],
							token: {
								start: { offset: 699, line: 46, column: 1 },
								end: { offset: 733, line: 47, column: 1 }
							}
						},
						{
							id: 24,
							name: 'title',
							note: '',
							type: { args: '200', schemaName: '', typeName: 'varchar(200)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 733, line: 47, column: 1 },
								end: { offset: 754, line: 48, column: 1 }
							}
						},
						{
							id: 25,
							name: 'updated_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 754, line: 48, column: 1 },
								end: { offset: 776, line: 49, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 653, line: 44, column: 1 },
						end: { offset: 777, line: 49, column: 2 }
					}
				},
				{
					id: 5,
					name: 'meta_content',
					note: '',
					fields: [
						{
							id: 26,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [],
							token: {
								start: { offset: 802, line: 52, column: 3 },
								end: { offset: 815, line: 53, column: 1 }
							}
						},
						{
							id: 27,
							name: 'meta_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 8,
									relation: '1',
									tableName: 'meta_content',
									fieldNames: ['meta_id'],
									refId: 4,
									token: {
										start: { offset: 831, line: 53, column: 17 },
										end: { offset: 845, line: 53, column: 31 }
									}
								}
							],
							token: {
								start: { offset: 815, line: 53, column: 1 },
								end: { offset: 847, line: 54, column: 1 }
							}
						},
						{
							id: 28,
							name: 'json',
							note: '',
							type: { args: null, schemaName: '', typeName: 'jsonb' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 847, line: 54, column: 1 },
								end: { offset: 860, line: 55, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 779, line: 51, column: 1 },
						end: { offset: 861, line: 55, column: 2 }
					}
				},
				{
					id: 6,
					name: 'refresh_queue',
					note: '',
					fields: [
						{
							id: 29,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [],
							token: {
								start: { offset: 887, line: 58, column: 3 },
								end: { offset: 900, line: 59, column: 1 }
							}
						},
						{
							id: 30,
							name: 'space_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 10,
									relation: '*',
									tableName: 'refresh_queue',
									fieldNames: ['space_id'],
									refId: 5,
									token: {
										start: { offset: 917, line: 59, column: 18 },
										end: { offset: 932, line: 59, column: 33 }
									}
								}
							],
							token: {
								start: { offset: 900, line: 59, column: 1 },
								end: { offset: 934, line: 60, column: 1 }
							}
						},
						{
							id: 31,
							name: 'source_type',
							note: '',
							type: { args: null, schemaName: '', typeName: 'refresh_queue_source_type' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 934, line: 60, column: 1 },
								end: { offset: 974, line: 61, column: 1 }
							}
						},
						{
							id: 32,
							name: 'page_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 974, line: 61, column: 1 },
								end: { offset: 989, line: 62, column: 1 }
							}
						},
						{
							id: 33,
							name: 'type',
							note: '',
							type: { args: null, schemaName: '', typeName: 'refresh_queue_type' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 989, line: 62, column: 1 },
								end: { offset: 1015, line: 63, column: 1 }
							}
						},
						{
							id: 34,
							name: 'state',
							note: '',
							type: { args: null, schemaName: '', typeName: 'refresh_queue_state' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1015, line: 63, column: 1 },
								end: { offset: 1043, line: 64, column: 1 }
							}
						},
						{
							id: 35,
							name: 'updated_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1043, line: 64, column: 1 },
								end: { offset: 1066, line: 66, column: 1 }
							}
						},
						{
							id: 36,
							name: 'created_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1066, line: 66, column: 1 },
								end: { offset: 1088, line: 67, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 863, line: 57, column: 1 },
						end: { offset: 1089, line: 67, column: 2 }
					}
				},
				{
					id: 7,
					name: 'space_message',
					note: '',
					fields: [
						{
							id: 37,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'UUID' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [],
							token: {
								start: { offset: 1320, line: 92, column: 3 },
								end: { offset: 1333, line: 93, column: 1 }
							}
						},
						{
							id: 38,
							name: 'sender_uid',
							note: '',
							type: { args: '36', schemaName: '', typeName: 'varchar(36)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1333, line: 93, column: 1 },
								end: { offset: 1358, line: 94, column: 1 }
							}
						},
						{
							id: 39,
							name: 'space_id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [
								{
									id: 12,
									relation: '*',
									tableName: 'space_message',
									fieldNames: ['space_id'],
									refId: 6,
									token: {
										start: { offset: 1375, line: 94, column: 18 },
										end: { offset: 1390, line: 94, column: 33 }
									}
								}
							],
							token: {
								start: { offset: 1358, line: 94, column: 1 },
								end: { offset: 1392, line: 95, column: 1 }
							}
						},
						{
							id: 40,
							name: 'title',
							note: '',
							type: { args: '1024', schemaName: '', typeName: 'varchar(1024)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1392, line: 95, column: 1 },
								end: { offset: 1414, line: 96, column: 1 }
							}
						},
						{
							id: 41,
							name: 'content',
							note: '',
							type: { args: null, schemaName: '', typeName: 'text' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1414, line: 96, column: 1 },
								end: { offset: 1429, line: 97, column: 1 }
							}
						},
						{
							id: 42,
							name: 'receive_address',
							note: '',
							type: { args: '256', schemaName: '', typeName: 'varchar(256)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1429, line: 97, column: 1 },
								end: { offset: 1460, line: 98, column: 1 }
							}
						},
						{
							id: 43,
							name: 'check_state',
							note: '',
							type: { args: null, schemaName: '', typeName: 'space_message_check_state' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1460, line: 98, column: 1 },
								end: { offset: 1500, line: 99, column: 1 }
							}
						},
						{
							id: 44,
							name: 'state',
							note: '',
							type: { args: null, schemaName: '', typeName: 'space_message_state' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1500, line: 99, column: 1 },
								end: { offset: 1528, line: 100, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 1296, line: 91, column: 1 },
						end: { offset: 1529, line: 100, column: 2 }
					}
				},
				{
					id: 8,
					name: 'member',
					note: '',
					fields: [
						{
							id: 45,
							name: 'uid',
							note: '',
							type: { args: '36', schemaName: '', typeName: 'varchar(36)' },
							increment: false,
							notNull: false,
							pk: true,
							endpoints: [],
							token: {
								start: { offset: 1712, line: 122, column: 3 },
								end: { offset: 1733, line: 123, column: 1 }
							}
						},
						{
							id: 46,
							name: 'access_token',
							note: '',
							type: { args: '255', schemaName: '', typeName: 'varchar(255)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1733, line: 123, column: 1 },
								end: { offset: 1761, line: 124, column: 1 }
							}
						},
						{
							id: 47,
							name: 'created_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1761, line: 124, column: 1 },
								end: { offset: 1783, line: 125, column: 1 }
							}
						},
						{
							id: 48,
							name: 'updated_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'datetime' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 1783, line: 125, column: 1 },
								end: { offset: 1805, line: 126, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 1695, line: 121, column: 1 },
						end: { offset: 1806, line: 126, column: 2 }
					}
				}
			],
			refs: [
				{
					id: 1,
					name: '',
					endpointIds: [1, 2],
					token: {
						start: { offset: 404, line: 28, column: 18 },
						end: { offset: 419, line: 28, column: 33 }
					}
				},
				{
					id: 2,
					name: '',
					endpointIds: [3, 4],
					token: {
						start: { offset: 621, line: 40, column: 17 },
						end: { offset: 635, line: 40, column: 31 }
					}
				},
				{
					id: 3,
					name: '',
					endpointIds: [5, 6],
					token: {
						start: { offset: 716, line: 46, column: 18 },
						end: { offset: 731, line: 46, column: 33 }
					}
				},
				{
					id: 4,
					name: '',
					endpointIds: [7, 8],
					token: {
						start: { offset: 831, line: 53, column: 17 },
						end: { offset: 845, line: 53, column: 31 }
					}
				},
				{
					id: 5,
					name: '',
					endpointIds: [9, 10],
					token: {
						start: { offset: 917, line: 59, column: 18 },
						end: { offset: 932, line: 59, column: 33 }
					}
				},
				{
					id: 6,
					name: '',
					endpointIds: [11, 12],
					token: {
						start: { offset: 1375, line: 94, column: 18 },
						end: { offset: 1390, line: 94, column: 33 }
					}
				},
				{
					id: 7,
					name: '',
					endpointIds: [13, 14],
					token: {
						start: { offset: 1820, line: 130, column: 1 },
						end: { offset: 1863, line: 130, column: 44 }
					}
				}
			]
		}
	]
};

export default data;
