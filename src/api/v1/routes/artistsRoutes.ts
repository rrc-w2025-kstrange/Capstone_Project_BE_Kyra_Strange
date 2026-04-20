import { Router } from 'express';
import { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } from '../controllers/artistsController';
import { validateRequest } from '../middleware/validate';
import { artistSchemas } from '../validation/Schema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = Router();

router.get('/', getAllArtists);
router.get('/:id', validateRequest(artistSchemas.getById), getArtistById);
router.post('/', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.create), createArtist);
router.put('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.update), updateArtist);
router.delete('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.delete), deleteArtist);

export default router;