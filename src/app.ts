import express, { Application } from 'express';
import { loggerMiddleware }     from './middlewares/logger.middleware';
import { errorMiddleware }      from './middlewares/error.middleware';
import noteRoutes               from './routes/note.routes';

const createApp = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);

  // Routes
  app.use('/api/notes', noteRoutes);

  // Route info
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: '📝 Notes API',
      version: '1.0.0',
      endpoints: {
        'GET    /api/notes':          'Liste toutes les notes',
        'GET    /api/notes/:id':      'Récupère une note',
        'POST   /api/notes':          'Crée une note',
        'PUT    /api/notes/:id':      'Met à jour une note',
        'DELETE /api/notes/:id':      'Supprime une note',
        'PATCH  /api/notes/:id/pin':  'Épingle / désépingle',
      },
    });
  });

  // Gestion d'erreurs — doit être en DERNIER
  app.use(errorMiddleware);

  return app;
};

export default createApp;