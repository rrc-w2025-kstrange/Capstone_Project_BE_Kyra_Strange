import { Router } from 'express';
import { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from '../controllers/albumsController';
import { validateRequest } from '../middleware/validate';
import { albumSchemas } from '../validation/Schema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = Router();

/**
 * @openapi
 * /api/v1/albums:
 *   get:
 *     summary: Get all albums
 *     description: Returns a list of all albums ordered by creation date.
 *     tags:
 *       - Albums
 *     responses:
 *       200:
 *         description: Albums successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Albums retrieved"
 *                 count:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Album'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllAlbums);

/**
 * @openapi
 * /api/v1/albums/{id}:
 *   get:
 *     summary: Get an album by ID
 *     description: Returns a single album by its ID.
 *     tags:
 *       - Albums
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "album_001"
 *     responses:
 *       200:
 *         description: Album successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Album retrieved"
 *                 data:
 *                   $ref: '#/components/schemas/Album'
 *       404:
 *         description: Album not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', validateRequest(albumSchemas.getById), getAlbumById);

/**
 * @openapi
 * /api/v1/albums:
 *   post:
 *     summary: Create a new album
 *     description: Create a new album. Requires admin role. The artistId must reference an existing artist.
 *     tags:
 *       - Albums
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artistId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Dark Side of the Moon"
 *               artistId:
 *                 type: string
 *                 example: "artist_001"
 *               releaseYear:
 *                 type: number
 *                 example: 1973
 *               genre:
 *                 type: string
 *                 enum: [Rock, Glam Rock, Reggae, Techno, Indie Rock, general]
 *                 example: "Rock"
 *     responses:
 *       201:
 *         description: Album successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Album created"
 *                 data:
 *                   $ref: '#/components/schemas/Album'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Artist not found
 *       500:
 *         description: Failed to create album
 */
router.post('/', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(albumSchemas.create), createAlbum);

/**
 * @openapi
 * /api/v1/albums/{id}:
 *   put:
 *     summary: Update an album
 *     description: Update an existing album by ID. Requires admin role.
 *     tags:
 *       - Albums
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "album_001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Dark Side of the Moon"
 *               artistId:
 *                 type: string
 *                 example: "artist_001"
 *               releaseYear:
 *                 type: number
 *                 example: 1973
 *               genre:
 *                 type: string
 *                 enum: [Rock, Glam Rock, Reggae, Techno, Indie Rock, general]
 *                 example: "Rock"
 *     responses:
 *       200:
 *         description: Album successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Album not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(albumSchemas.update), updateAlbum);

/**
 * @openapi
 * /api/v1/albums/{id}:
 *   delete:
 *     summary: Delete an album
 *     description: Delete an album by ID. Requires admin role.
 *     tags:
 *       - Albums
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "album_001"
 *     responses:
 *       200:
 *         description: Album successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "album_001 was deleted"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Album not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(albumSchemas.delete), deleteAlbum);

export default router;