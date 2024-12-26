import { z } from 'zod';

export const ArgumentSchema = z.object({
  query: z.string().nonempty('Query is required').default('default-query'),
  pages: z.number().int().min(1).default(1),
  minRating: z.number().min(0).default(0),
  format: z.string().default('json'),
});

export type Arguments = z.infer<typeof ArgumentSchema>;
