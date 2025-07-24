import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/data/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.object({
      teaser: z.object({
        path: z.string(),
        alt: z.string(),
      }),
      feature: z.string(),
    }),
  }),
});

const tournaments = defineCollection({
  loader: file("src/tournaments.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    dots: z.number(),
    date: z.string().transform((date) => new Date(date)),
    eligibility: z.enum(["open", "closed"]),
    location: z.union([z.string(), z.array(z.string())]).optional(),
    link: z.string().optional(),
  }),
});

export const collections = { blog, tournaments };
