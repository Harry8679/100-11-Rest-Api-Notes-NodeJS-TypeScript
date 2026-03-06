import { z } from 'zod';

export const CreateNoteSchema = z.object({
  title:   z.string().min(1, 'Le titre est requis').max(100),
  content: z.string().min(1, 'Le contenu est requis'),
  tags:    z.array(z.string()).optional().default([]),
  pinned:  z.boolean().optional().default(false),
});

export const UpdateNoteSchema = z.object({
  title:   z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
  tags:    z.array(z.string()).optional(),
  pinned:  z.boolean().optional(),
});

export const NoteQuerySchema = z.object({
  search: z.string().optional(),
  tag:    z.string().optional(),
  pinned: z.string().transform((v) => v === 'true').optional(),
  page:   z.string().transform((v) => parseInt(v) || 1).optional(),
  limit:  z.string().transform((v) => parseInt(v) || 10).optional(),
});