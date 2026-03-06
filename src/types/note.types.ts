export interface Note {
  id:        string;
  title:     string;
  content:   string;
  tags:      string[];
  pinned:    boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteDTO = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNoteDTO = Partial<Omit<Note, 'id' | 'createdAt'>>;

export interface NoteFilters {
  search?: string;
  tag?:    string;
  pinned?: boolean;
}

export interface PaginatedNotes {
  data:       Note[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}