import { Router } from 'express';
import { getAllSongs, getSongById, createSong, updateSong, deleteSong, uploadSongFile } from '../controllers/songsController';
import upload from '../middleware/upload';  
import { validateRequest } from '../middleware/validate';
import { songSchemas } from '../validation/Schema';

const router: Router = Router();

router.get('/', getAllSongs);
router.get('/:id', validateRequest(songSchemas.getById), getSongById);
router.post('/upload', upload.single('file'), uploadSongFile);  
router.post('/', validateRequest(songSchemas.create), createSong);
router.put('/:id', validateRequest(songSchemas.update), updateSong);
router.delete('/:id', validateRequest(songSchemas.delete), deleteSong);

export default router;
