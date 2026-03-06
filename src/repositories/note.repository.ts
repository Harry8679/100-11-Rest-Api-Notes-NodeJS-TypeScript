import * as fs   from 'fs/promises';
import * as path from 'path';
import { Note }  from '../types/note.types';

export class NoteRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'notes.json');
  }

  async init(): Promise<void> {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, '[]', 'utf-8');
    }
  }

  async findAll(): Promise<Note[]> {
    const content = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(content) as Note[];
  }

  async findById(id: string): Promise<Note | null> {
    const notes = await this.findAll();
    return notes.find((n) => n.id === id) ?? null;
  }

  async save(note: Note): Promise<void> {
    const notes = await this.findAll();
    const index = notes.findIndex((n) => n.id === note.id);
    if (index === -1) notes.push(note);
    else notes[index] = note;
    await fs.writeFile(this.filePath, JSON.stringify(notes, null, 2), 'utf-8');
  }

  async delete(id: string): Promise<boolean> {
    const notes   = await this.findAll();
    const updated = notes.filter((n) => n.id !== id);
    if (updated.length === notes.length) return false;
    await fs.writeFile(this.filePath, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  }
}