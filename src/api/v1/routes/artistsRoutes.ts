import { Router } from 'express';
import { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } from '../controllers/artistsController';
import { validateRequest } from '../middleware/validate';
import { artistSchemas } from '../validation/Schema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = Router();

router.get('/', getAllArtists);
router.get('/:id', validateRequest(artistSchemas.getById), getArtistById);
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
router.post('/', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.create), createArtist);
router.put('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.update), updateArtist);
router.delete('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.delete), deleteArtist);

export default router;