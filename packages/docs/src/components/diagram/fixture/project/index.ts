import type { Project } from "./type";

export default {
  id: 1,
  name: "",
  databaseType: "",
  note: "",
  schemas: [
    {
      id: 1,
      name: "public",
      note: "Default Public Schema",
      enums: [],
      groups: [],
      tables: [
        {
          id: 1,
          name: "member",
          note: "",
          fields: [
            {
              id: 1,
              name: "id",
              type: { args: null, schemaName: "", typeName: "uuid" },
              increment: false,
              notNull: false,
              pk: true,
              endpoints: [],
              token: {
                start: { offset: 18, line: 3, column: 3 },
                end: { offset: 26, line: 4, column: 1 },
              },
            },
            {
              id: 2,
              name: "name",
              type: { args: "200", schemaName: "", typeName: "varchar(200)" },
              increment: false,
              notNull: false,
              pk: false,
              endpoints: [],
              token: {
                start: { offset: 26, line: 4, column: 1 },
                end: { offset: 46, line: 5, column: 1 },
              },
            },
            {
              id: 3,
              name: "space_id",
              note: "",
              type: { args: null, schemaName: "", typeName: "uuid" },
              increment: false,
              notNull: false,
              pk: false,
              endpoints: [
                {
                  id: 1,
                  relation: "*",
                  tableName: "member",
                  fieldNames: ["space_id"],
                  refId: 1,
                  token: {
                    start: { offset: 107, line: 13, column: 1 },
                    end: { offset: 138, line: 13, column: 32 },
                  },
                },
              ],
              token: {
                start: { offset: 46, line: 5, column: 1 },
                end: { offset: 62, line: 6, column: 1 },
              },
            },
          ],
          indexes: [],
          meta: {},
          token: {
            start: { offset: 1, line: 2, column: 1 },
            end: { offset: 63, line: 6, column: 2 },
          },
        },
        {
          id: 2,
          name: "space",
          note: "",
          fields: [
            {
              id: 4,
              name: "id",
              note: "",
              type: { args: null, schemaName: "", typeName: "uuid" },
              increment: false,
              notNull: false,
              pk: true,
              endpoints: [
                {
                  id: 2,
                  relation: "1",
                  tableName: "space",
                  fieldNames: ["id"],
                  refId: 1,
                  token: {
                    start: { offset: 107, line: 13, column: 1 },
                    end: { offset: 138, line: 13, column: 32 },
                  },
                },
              ],
              token: {
                start: { offset: 81, line: 9, column: 3 },
                end: { offset: 89, line: 10, column: 1 },
              },
            },
            {
              id: 5,
              name: "name",
              note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
              type: { args: null, schemaName: "", typeName: "varchar" },
              increment: false,
              notNull: false,
              pk: false,
              endpoints: [],
              token: {
                start: { offset: 89, line: 10, column: 1 },
                end: { offset: 104, line: 11, column: 1 },
              },
            },
          ],
          indexes: [],
          meta: {},
          token: {
            start: { offset: 65, line: 8, column: 1 },
            end: { offset: 105, line: 11, column: 2 },
          },
        },
      ],
      refs: [
        {
          id: 1,
          name: "",
          endpointIds: [1, 2],
          token: {
            start: { offset: 107, line: 13, column: 1 },
            end: { offset: 138, line: 13, column: 32 },
          },
        },
      ],
    },
  ],
} satisfies Project;
