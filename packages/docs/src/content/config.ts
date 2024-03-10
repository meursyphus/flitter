import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content", 
  schema: z.object({
    nav_group: z.string(),
    nav_group_order: z.number(),
    nav_order: z.number(),
    nav_title: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  })
});

export const collections = {
  docs: docs,
};
