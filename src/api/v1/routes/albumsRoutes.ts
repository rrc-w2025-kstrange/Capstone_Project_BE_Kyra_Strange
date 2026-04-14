import { Router } from 'express';
import {
    getAllAlbums,
    getAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum
} from '../controllers/albumsController';
import { validateRequest } from '../middleware/validate';
import { albumSchemas } from '../validation/Schema';

const router: Router = Router();

router.get('/', getAllAlbums);
router.get('/:id', validateRequest(albumSchemas.getById), getAlbumById);
router.post('/', validateRequest(albumSchemas.create), createAlbum);
router.put('/:id', validateRequest(albumSchemas.update), updateAlbum);
router.delete('/:id', validateRequest(albumSchemas.delete), deleteAlbum);

export default router;
