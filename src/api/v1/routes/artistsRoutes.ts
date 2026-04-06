import { Router } from 'express';
import { 
    getAllArtists,
    getArtistById,
    createArtist,
    updateArtist,
    deleteArtist
} from '../controllers/artistsController';


const router: Router = Router();


router.get('/', getAllArtists);
router.get('/:id', getArtistById);
/**
 * @openapi
 * /api/v1/artists:
 *   post:
 *     summary: Create a new artist
 *     description: Create a new artist with name, status, and category. If status or category are not provided, default values will be applied.
 *     tags:
 *       - Artists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Elvis Presley"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, passed]
 *                 example: "Passed"
 *               category:
 *                 type: string
 *                 enum: [Rock, Reggae, Techno, Alt]
 *                 example: "Rock"
 *     responses:
 *       201:
 *         description: Artist successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Artist created"
 *                 data:
 *                   $ref: '#/components/schemas/Artist'
 *       500:
 *         description: Failed to create artist
 */
router.post('/', createArtist);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

export default router;
