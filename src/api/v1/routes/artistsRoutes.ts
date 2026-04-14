import { Router } from 'express';
import { 
    getAllArtists,
    getArtistById,
    createArtist,
    updateArtist,
    deleteArtist
} from '../controllers/artistsController';
import { validateRequest } from '../middleware/validate';
import { artistSchemas } from '../validation/Schema';


const router: Router = Router();

router.get('/', getAllArtists);
router.get('/:id', validateRequest(artistSchemas.getById), getArtistById);
router.post('/', validateRequest(artistSchemas.create), createArtist);
router.put('/:id', validateRequest(artistSchemas.update), updateArtist);
router.delete('/:id', validateRequest(artistSchemas.delete), deleteArtist);

export default router;
