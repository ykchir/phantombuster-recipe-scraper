import { z } from 'zod';

export const ArgumentSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  pages: z.number().int().positive().default(1),
});

export type Arguments = z.infer<typeof ArgumentSchema>;
