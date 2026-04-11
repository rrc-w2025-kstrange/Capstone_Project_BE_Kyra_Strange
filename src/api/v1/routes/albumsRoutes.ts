import { Router } from 'express';
import {
    getAllAlbums,
    getAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum
} from '../controllers/albumsController';

const router: Router = Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
