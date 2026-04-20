import { Router } from 'express';
import { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } from '../controllers/artistsController';
import { validateRequest } from '../middleware/validate';
import { artistSchemas } from '../validation/Schema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = Router();

/**
 * @openapi
 * /api/v1/artists:
 *   get:
 *     summary: Get all artists
 *     description: Returns a list of all artists ordered by creation date.
 *     tags:
 *       - Artists
 *     responses:
 *       200:
 *         description: Artists successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Artists retrieved"
 *                 count:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Artist'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllArtists);

/**
 * @openapi
 * /api/v1/artists/{id}:
 *   get:
 *     summary: Get an artist by ID
 *     description: Returns a single artist by their ID.
 *     tags:
 *       - Artists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "artist_001"
 *     responses:
 *       200:
 *         description: Artist successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Artist retrieved"
 *                 data:
 *                   $ref: '#/components/schemas/Artist'
 *       404:
 *         description: Artist not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', validateRequest(artistSchemas.getById), getArtistById);

/**
 * @openapi
 * /api/v1/artists:
 *   post:
 *     summary: Create a new artist
 *     description: Create a new artist. Requires admin role. If status or category are not provided, defaults will be applied.
 *     tags:
 *       - Artists
 *     security:
 *       - bearerAuth: []
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
 *                 enum: [active, inactive, passed away]
 *                 example: "active"
 *               category:
 *                 type: string
 *                 enum: [Rock, Glam Rock, Reggae, Techno, Indie Rock, general]
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       500:
 *         description: Failed to create artist
 */
router.post('/', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.create), createArtist);

/**
 * @openapi
 * /api/v1/artists/{id}:
 *   put:
 *     summary: Update an artist
 *     description: Update an existing artist by ID. Requires admin role.
 *     tags:
 *       - Artists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "artist_001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Elvis Presley"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, passed away]
 *                 example: "active"
 *               category:
 *                 type: string
 *                 enum: [Rock, Glam Rock, Reggae, Techno, Indie Rock, general]
 *                 example: "Rock"
 *     responses:
 *       200:
 *         description: Artist successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Artist not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.update), updateArtist);

/**
 * @openapi
 * /api/v1/artists/{id}:
 *   delete:
 *     summary: Delete an artist
 *     description: Delete an artist by ID. Requires admin role.
 *     tags:
 *       - Artists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "artist_001"
 *     responses:
 *       200:
 *         description: Artist successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "artist_001 was deleted"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Artist not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(artistSchemas.delete), deleteArtist);

export default router;