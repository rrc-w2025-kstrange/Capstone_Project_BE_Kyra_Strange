import { Router } from 'express';
import { 
    getAllArtists,
    getArtistById,
    createArtist,
    updateArtist,
} from '../controllers/artistsController';


const router: Router = Router();

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.post('/', createArtist);
router.put('/:id', updateArtist);
// router.delete('/:id', deleteArtist);

export default router;
