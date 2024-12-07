import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    nav_group: z.string(),
    nav_order: z.number().optional(),
    nav_title: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const tutorial = defineCollection({
  type: "content",
  schema: z.object({
    nav_group: z.string(),
    nav_order: z.number().optional(),
    title: z.string(),
    files: z.record(z.string()),
    solved_files: z.record(z.string()).optional(),
  }),
});


export const collections = {
  docs: docs,
  tutorial: tutorial,
};
