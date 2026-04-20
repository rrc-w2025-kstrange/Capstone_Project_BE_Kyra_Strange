import { Router } from 'express';
import { getAllSongs, getSongById, createSong, updateSong, deleteSong, uploadSongFile } from '../controllers/songsController';
import upload from '../middleware/upload';
import { validateRequest } from '../middleware/validate';
import { songSchemas } from '../validation/Schema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = Router();

/**
 * @openapi
 * /api/v1/songs:
 *   get:
 *     summary: Get all songs
 *     description: Returns a list of all songs ordered by creation date. Songs with a linked file will include a filePath.
 *     tags:
 *       - Songs
 *     responses:
 *       200:
 *         description: Songs successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Songs retrieved"
 *                 count:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Song'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllSongs);

/**
 * @openapi
 * /api/v1/songs/{id}:
 *   get:
 *     summary: Get a song by ID
 *     description: Returns a single song by its ID.
 *     tags:
 *       - Songs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "song_001"
 *     responses:
 *       200:
 *         description: Song successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Song retrieved"
 *                 data:
 *                   $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', validateRequest(songSchemas.getById), getSongById);

/**
 * @openapi
 * /api/v1/songs/upload:
 *   post:
 *     summary: Upload a file and link it to a song
 *     description: Upload an MP3, M4A, or MP4 file and link it to an existing song by songId. Requires admin role. Max file size is 300MB for MP4 and 10MB for audio files.
 *     tags:
 *       - Songs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - songId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The audio or video file to upload (MP3, M4A, or MP4)
 *               songId:
 *                 type: string
 *                 example: "song_001"
 *     responses:
 *       201:
 *         description: File successfully uploaded and linked to song
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded and linked to song"
 *                 data:
 *                   type: object
 *                   properties:
 *                     songId:
 *                       type: string
 *                       example: "song_001"
 *                     filename:
 *                       type: string
 *                       example: "2026-04-19T15-30-00-beautiful-day.mp3"
 *                     originalname:
 *                       type: string
 *                       example: "beautiful day.mp3"
 *                     size:
 *                       type: string
 *                       example: "4.31 MB"
 *                     path:
 *                       type: string
 *                       example: "http://localhost:3000/uploads/2026-04-19T15-30-00-beautiful-day.mp3"
 *       400:
 *         description: No file uploaded, invalid file type, or missing songId
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       500:
 *         description: Failed to link file to song
 */
router.post('/upload', authenticate, isAuthorized({ hasRole: ["admin"] }), upload.single('file'), uploadSongFile);

/**
 * @openapi
 * /api/v1/songs:
 *   post:
 *     summary: Create a new song
 *     description: Create a new song linked to an existing album. Requires admin role.
 *     tags:
 *       - Songs
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
 *               - albumId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Beautiful Day"
 *               albumId:
 *                 type: string
 *                 example: "album_001"
 *               duration:
 *                 type: number
 *                 example: 248
 *                 description: Duration in seconds (min 30, max 900)
 *     responses:
 *       201:
 *         description: Song successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Song created"
 *                 data:
 *                   $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Album not found
 *       500:
 *         description: Failed to create song
 */
router.post('/', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(songSchemas.create), createSong);

/**
 * @openapi
 * /api/v1/songs/{id}:
 *   put:
 *     summary: Update a song
 *     description: Update an existing song by ID. Requires admin role. At least one field must be provided.
 *     tags:
 *       - Songs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "song_001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Beautiful Day"
 *               albumId:
 *                 type: string
 *                 example: "album_001"
 *               duration:
 *                 type: number
 *                 example: 248
 *                 description: Duration in seconds (min 30, max 900)
 *     responses:
 *       200:
 *         description: Song successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Song not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(songSchemas.update), updateSong);

/**
 * @openapi
 * /api/v1/songs/{id}:
 *   delete:
 *     summary: Delete a song
 *     description: Delete a song by ID. Requires admin role.
 *     tags:
 *       - Songs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "song_001"
 *     responses:
 *       200:
 *         description: Song successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "song_001 was deleted"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Insufficient role
 *       404:
 *         description: Song not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(songSchemas.delete), deleteSong);

export default router;