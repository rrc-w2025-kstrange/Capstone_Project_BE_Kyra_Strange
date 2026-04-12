import { Router } from 'express';
import { getAllSongs, getSongById, createSong, updateSong, deleteSong, uploadSongFile } from '../controllers/songsController';
import upload from '../middleware/upload';  

const router: Router = Router();

router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/upload', upload.single('file'), uploadSongFile);  
router.post('/', createSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;
