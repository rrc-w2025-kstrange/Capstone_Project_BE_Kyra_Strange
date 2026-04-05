import { Router } from 'express';


const router: Router = Router();

router.post('/', createArtist);
router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

export default router;
