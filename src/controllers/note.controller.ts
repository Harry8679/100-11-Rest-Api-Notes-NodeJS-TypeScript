import { Request, Response, NextFunction } from 'express';
import { NoteService }  from '../services/note.service';
import { AppError }     from '../middlewares/error.middleware';
import { sendSuccess }  from '../utils/response';

export class NoteController {
  private service: NoteService;

  constructor(service: NoteService) {
    this.service = service;
  }

  // GET /api/notes
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, tag, pinned, page, limit } = req.query as Record<string, string>;
      const result = await this.service.getNotes(
        {
          search,
          tag,
          pinned: pinned !== undefined ? pinned === 'true' : undefined,
        },
        parseInt(page)  || 1,
        parseInt(limit) || 10
      );
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/notes/:id
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await this.service.getNoteById(req.params.id);
      if (!note) throw new AppError('Note introuvable', 404);
      sendSuccess(res, note);
    } catch (err) {
      next(err);
    }
  };

  // POST /api/notes
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await this.service.createNote(req.body);
      sendSuccess(res, note, 201);
    } catch (err) {
      next(err);
    }
  };

  // PUT /api/notes/:id
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await this.service.updateNote(req.params.id, req.body);
      if (!note) throw new AppError('Note introuvable', 404);
      sendSuccess(res, note);
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/notes/:id
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.deleteNote(req.params.id);
      if (!deleted) throw new AppError('Note introuvable', 404);
      sendSuccess(res, { message: 'Note supprimée' });
    } catch (err) {
      next(err);
    }
  };

  // PATCH /api/notes/:id/pin
  togglePin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await this.service.togglePin(req.params.id);
      if (!note) throw new AppError('Note introuvable', 404);
      sendSuccess(res, note);
    } catch (err) {
      next(err);
    }
  };
}