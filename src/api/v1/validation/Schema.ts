import Joi from "joi";

// ARTIST SCHEMAS
export const artistSchemas = {

    // POST /artists - Create new artist
    create: {
        body: Joi.object({
            name: Joi.string().min(2).required().messages({
                "any.required": 'Validation error: "name" is required',
                "string.empty": 'Validation error: "name" cannot be empty',
                "string.min": 'Validation error: "name" must be at least 2 characters long',
            }),
            status: Joi.string().valid("active", "inactive", "passed away").default("active").messages({
                "any.only": 'Validation error: "status" must be one of [active, inactive, passed away]',
            }),
            category: Joi.string().valid("Rock", "Glam Rock", "Reggae", "Techno", "Indie Rock", "general").default("general").messages({
                "any.only": 'Validation error: "category" must be one of [Rock, Glam Rock, Reggae, Techno, Indie Rock, general]',
            }),
        }),
    },

    // GET /artists/:id - Get single artist
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
    },

    // PUT /artists/:id - Update artist
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
        body: Joi.object({
            name: Joi.string().min(2).optional(),
            status: Joi.string().valid("active", "inactive", "passed away").optional(),
            category: Joi.string().valid("Rock", "Glam Rock", "Reggae", "Techno", "Indie Rock", "general").optional(),
        }).min(1),  // at least one field must be sent
    },

    // DELETE /artists/:id - Delete artist
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
    },
};

// ALBUM SCHEMAS
export const albumSchemas = {

    // POST /albums - Create new album
    create: {
        body: Joi.object({
            title: Joi.string().min(1).required().messages({
                "any.required": 'Validation error: "title" is required',
                "string.empty": 'Validation error: "title" cannot be empty',
            }),
            artistId: Joi.string().required().messages({
                "any.required": 'Validation error: "artistId" is required',
            }),
            releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional().messages({
                "number.min": 'Validation error: "releaseYear" must be 1900 or later',
                "number.max": 'Validation error: "releaseYear" cannot be in the future',
            }),
            genre: Joi.string().valid("Rock", "Glam Rock", "Reggae", "Techno", "Indie Rock", "general").default("general").messages({
                "any.only": 'Validation error: "genre" must be one of [Rock, Glam Rock, Reggae, Techno, Indie Rock, general]',
            }),
        }),
    },

    // GET /albums/:id - Get single album
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
    },

    // PUT /albums/:id - Update album
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
        body: Joi.object({
            title: Joi.string().min(1).optional(),
            artistId: Joi.string().optional(),
            releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
            genre: Joi.string().valid("Rock", "Glam Rock", "Reggae", "Techno", "Indie Rock", "general").optional(),
        }).min(1),
    },

    // DELETE /albums/:id - Delete album
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
    },
};

// SONG SCHEMAS
export const songSchemas = {

    // POST /songs - Create new song
    create: {
        body: Joi.object({
            title: Joi.string().min(1).required().messages({
                "any.required": 'Validation error: "title" is required',
                "string.empty": 'Validation error: "title" cannot be empty',
            }),
            albumId: Joi.string().required().messages({
                "any.required": 'Validation error: "albumId" is required',
            }),
            duration: Joi.number().integer().min(30).max(15 * 60).optional().messages({
                "number.base": 'Validation error: "duration" must be a number (seconds)',
                "number.integer": 'Validation error: "duration" must be a whole number',
                "number.min": 'Validation error: "duration" must be at least 30 seconds',
                "number.max": 'Validation error: "duration" must be less than or equal to 900 seconds (15 minutes)',
            }),
        }),
    },

    // GET /songs/:id - Get single song
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
    },

    // PUT /songs/:id - Update song
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
        body: Joi.object({
            title: Joi.string().min(1).optional(),
            albumId: Joi.string().optional(),
            duration: Joi.number().integer().min(30).max(15 * 60).optional().messages({
                "number.base": 'Validation error: "duration" must be a number (seconds)',
                "number.integer": 'Validation error: "duration" must be a whole number',
                "number.min": 'Validation error: "duration" must be at least 30 seconds',
                "number.max": 'Validation error: "duration" must be less than or equal to 900 seconds (15 minutes)',
            }),
        }).min(1),
    },

    // DELETE /songs/:id - Delete song
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": 'Validation error: "id" is required',
            }),
        }),
    },
};