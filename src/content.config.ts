import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

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

export const collections = { tournaments };
