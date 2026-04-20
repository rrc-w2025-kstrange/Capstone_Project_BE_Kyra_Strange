import { Router } from 'express';
import { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from '../controllers/albumsController';
import { validateRequest } from '../middleware/validate';
import { albumSchemas } from '../validation/Schema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = Router();

router.get('/', getAllAlbums);
router.get('/:id', validateRequest(albumSchemas.getById), getAlbumById);
router.post('/', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(albumSchemas.create), createAlbum);
router.put('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(albumSchemas.update), updateAlbum);
router.delete('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(albumSchemas.delete), deleteAlbum);

export default router;