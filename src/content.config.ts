// src/content.config.ts
import { defineCollection, z } from 'astro:content';

// 'about' and 'cv' folders are read directly via Astro.glob — not via getCollection.
// Registering them here suppresses the "auto-generated collection" deprecation warning.
const about = defineCollection({ type: 'content', schema: z.object({}).passthrough() });
const cv = defineCollection({ type: 'content', schema: z.object({}).passthrough() });

const profile = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.object({ en: z.string(), vi: z.string() }),
    tagline: z.object({ en: z.string(), vi: z.string() }),
    location: z.string(),
    email: z.string().email(),
    socials: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      facebook: z.string().url().optional(),
    }),
    cvFile: z.string(), // path to /public/cv.pdf
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    role: z.object({ en: z.string(), vi: z.string() }),
    period: z.object({ start: z.string(), end: z.string().nullable() }),
    logo: z.string().optional(),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.object({ en: z.string(), vi: z.string() }),
    cover: z.string(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    stack: z.array(z.string()),
    featured: z.boolean().default(false),
    stars: z.number().optional(),
    category: z.enum(['ai-ml', 'backend', 'devops', 'web', 'research']),
    publishedAt: z.date(),
  }),
});

const papers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    pdf: z.string().optional(),
    doi: z.string().optional(),
    award: z.string().optional(), // "🏆 1st Place ALQAC 2023"
  }),
});

const skills = defineCollection({
  type: 'data',
  schema: z.object({
    groups: z.array(z.object({
      category: z.string(),
      items: z.array(z.object({
        name: z.string(),
        level: z.number().min(1).max(5),
        years: z.number().optional(),
        icon: z.string().optional(),
      })),
    })),
  }),
});

export const collections = { profile, experience, projects, papers, skills, about, cv };
