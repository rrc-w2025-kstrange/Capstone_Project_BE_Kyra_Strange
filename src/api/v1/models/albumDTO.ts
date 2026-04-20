/**
 * @openapi
 * components:
 *   schemas:
 *     Album:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - artistId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           example: "album_001"
 *         title:
 *           type: string
 *           example: "The Dark Side of the Moon"
 *         artistId:
 *           type: string
 *           example: "artist_001"
 *         releaseYear:
 *           type: number
 *           example: 1973
 *         genre:
 *           type: string
 *           enum: [Rock, Glam Rock, Reggae, Techno, Indie Rock, general]
 *           example: "Rock"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-05T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-05T12:30:00Z"
 */
export interface AlbumDTO {
    id: string | undefined;
    title: string | undefined;
    artistId: string | undefined;
    releaseYear: number | undefined;
    genre: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}