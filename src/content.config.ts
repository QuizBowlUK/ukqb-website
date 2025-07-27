import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const committee = defineCollection({
  loader: async () => {
    const data = await import("./data/committee.json");
    return data.default.map((member: any) => ({
      id: member.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      ...member,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    position: z.string(),
    bio: z.string(),
    image: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/data/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.object({
      teaser: z.object({
        path: z.string(),
        alt: z.string().optional(),
      }),
      feature: z.string().optional(),
    }),
  }),
});

const tournaments = defineCollection({
  loader: file("src/data/tournaments.json"),
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

export const collections = { committee, blog, tournaments };
