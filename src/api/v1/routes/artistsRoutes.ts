import { Router } from 'express';
import { 
    getArtistById,
    createArtist,
} from '../controllers/artistsController';


const router: Router = Router();

router.post('/', createArtist);
// router.get('/', getAllArtists);
router.get('/:id', getArtistById);
// router.put('/:id', updateArtist);
// router.delete('/:id', deleteArtist);

export default router;
