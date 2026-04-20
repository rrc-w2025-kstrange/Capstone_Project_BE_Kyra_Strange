import { Router } from 'express';
import { getAllSongs, getSongById, createSong, updateSong, deleteSong, uploadSongFile } from '../controllers/songsController';
import upload from '../middleware/upload';
import { validateRequest } from '../middleware/validate';
import { songSchemas } from '../validation/Schema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = Router();

router.get('/', getAllSongs);
router.get('/:id', validateRequest(songSchemas.getById), getSongById);
router.post('/upload', authenticate, isAuthorized({ hasRole: ["admin"] }), upload.single('file'), uploadSongFile);
router.post('/', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(songSchemas.create), createSong);
router.put('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(songSchemas.update), updateSong);
router.delete('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(songSchemas.delete), deleteSong);

export default router;