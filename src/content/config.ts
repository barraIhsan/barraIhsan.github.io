// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// Define a `type` and `schema` for each collection
const blogsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    desc: z.string(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  blogs: blogsCollection,
};
