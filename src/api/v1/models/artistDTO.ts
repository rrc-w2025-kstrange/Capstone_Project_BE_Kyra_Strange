/**
 * @openapi
 * components:
 *   schemas:
 *     Artist:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - status
 *         - category
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           example: "artist_001"
 *         name:
 *           type: string
 *           example: "Enya"
 *         status:
 *           type: string
 *           enum: [active, inactive, passed]
 *           example: "active"
 *         category:
 *           type: string
 *           enum: [Rock, Reggae, Techno, Alt]
 *           example: "Alt"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-05T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-05T12:30:00Z"
 */
export interface ArtistDTO {
    id: string | undefined;
    name: string | undefined;
    status: string | undefined;
    category: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}