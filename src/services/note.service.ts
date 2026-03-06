import { v4 as uuidv4 }   from 'uuid';
import { NoteRepository } from '../repositories/note.repository';
import {
  Note,
  CreateNoteDTO,
  UpdateNoteDTO,
  NoteFilters,
  PaginatedNotes,
} from '../types/note.types';

export class NoteService {
  private repo: NoteRepository;

  constructor() {
    this.repo = new NoteRepository();
  }

  async init(): Promise<void> {
    await this.repo.init();
  }

  async getNotes(
    filters: NoteFilters = {},
    page:  number = 1,
    limit: number = 10
  ): Promise<PaginatedNotes> {
    let notes = await this.repo.findAll();

    // Filtres
    if (filters.search) {
      const q = filters.search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    if (filters.tag) {
      notes = notes.filter((n) => n.tags.includes(filters.tag!));
    }

    if (filters.pinned !== undefined) {
      notes = notes.filter((n) => n.pinned === filters.pinned);
    }

    // Tri — épinglées en premier
    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const total      = notes.length;
    const totalPages = Math.ceil(total / limit);
    const data       = notes.slice((page - 1) * limit, page * limit);

    return { data, total, page, limit, totalPages };
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.repo.findById(id);
  }

  async createNote(dto: CreateNoteDTO): Promise<Note> {
    const now  = new Date().toISOString();
    const note: Note = {
      id:        uuidv4(),
      ...dto,
      createdAt: now,
      updatedAt: now,
    };
    await this.repo.save(note);
    return note;
  }

  async updateNote(id: string, dto: UpdateNoteDTO): Promise<Note | null> {
    const note = await this.repo.findById(id);
    if (!note) return null;

    const updated: Note = {
      ...note,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    await this.repo.save(updated);
    return updated;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }

  async togglePin(id: string): Promise<Note | null> {
    const note = await this.repo.findById(id);
    if (!note) return null;
    return this.updateNote(id, { pinned: !note.pinned });
  }
}