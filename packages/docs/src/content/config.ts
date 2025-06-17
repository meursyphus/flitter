import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
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
    title: z.string(),
    nav_title: z.string().optional(),
    image: z.string().optional(),
    description: z.string(),
    files: z.record(z.string()),
    solved_files: z.record(z.string()).optional(),
  }),
});


export const collections = {
  docs: docs,
  tutorial: tutorial,
};
