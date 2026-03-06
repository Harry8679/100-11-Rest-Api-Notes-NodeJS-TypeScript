import { Router }          from 'express';
import { NoteController }  from '../controllers/note.controller';
import { NoteService }     from '../services/note.service';
import { validate }        from '../middlewares/validate.middleware';
import {
  CreateNoteSchema,
  UpdateNoteSchema,
} from '../schemas/note.schema';

const router     = Router();
const service    = new NoteService();
const controller = new NoteController(service);

// Init DB
service.init();

router.get('/',           controller.getAll);
router.get('/:id',        controller.getById);
router.post('/',          validate(CreateNoteSchema), controller.create);
router.put('/:id',        validate(UpdateNoteSchema), controller.update);
router.delete('/:id',     controller.delete);
router.patch('/:id/pin',  controller.togglePin);

export default router;