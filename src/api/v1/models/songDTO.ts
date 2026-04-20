/**
 * @openapi
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - albumId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           example: "song_001"
 *         title:
 *           type: string
 *           example: "Beautiful Day"
 *         albumId:
 *           type: string
 *           example: "album_001"
 *         duration:
 *           type: number
 *           example: 248
 *           description: Duration in seconds
 *         filePath:
 *           type: string
 *           example: "http://localhost:3000/uploads/2026-04-19T15-30-00-beautiful-day.mp3"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-05T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-05T12:30:00Z"
 */
export interface SongDTO {
    id: string | undefined;
    title: string | undefined;
    albumId: string | undefined;
    duration: number | undefined;
    filePath?: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}