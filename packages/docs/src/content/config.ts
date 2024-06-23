import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    nav_group: z.string(),
    nav_group_order: z.number(),
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
    files: z.record(z.string()),
    title: z.string(),
  }),
});

export const collections = {
  docs: docs,
  tutorial: tutorial,
};
