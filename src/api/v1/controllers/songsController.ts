import { Request, Response, NextFunction } from "express";
import { getAllSongsService, getSongByIdService, createNewSong, updateSongById, deleteSongById } from "../services/songsService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateSongRequest } from "../models/createSongRequestModel";
import { AppError } from "../errors/errors";
import { fromFile } from "file-type";
import fs from "fs";                          


/**
 * Retrieves all songs from the database ordered by creation date.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with all songs and total count
 */
export const getAllSongs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const songs = await getAllSongsService();
        res.status(HTTP_STATUS.OK).json({
            message: "Songs retrieved",
            count: songs?.length || 0,
            data: songs
        });
    } catch (error) {
        next(error);
    }
};


/**
 * Retrieves a single song by its ID.
 * @param req - Express request object containing `id` in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with the song data or 404 if not found
 */
export const getSongById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const result = await getSongByIdService(id);

        if (!result) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Song not found' });
            return;
        }

        res.status(HTTP_STATUS.OK).json({ message: 'Song retrieved', data: result });
    } catch (error) {
        next(error);
    }
};


/**
 * Creates a new song linked to an existing album.
 * @param req - Express request object containing song data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with the created song or 404 if album not found
 */
export const createSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await createNewSong(req.body as CreateSongRequest);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Song created",
            data: result
        });
    } catch (error: any) {
        if (error.message === "Album not found") {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Album not found" });
            return;
        }
        next(error);
    }
};


/**
 * Updates an existing song by ID.
 * Checks existence before updating to return a proper 404 instead of a DB error.
 * @param req - Express request object containing `id` in params and update fields in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with the updated song or 404 if not found
 */
export const updateSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id;

        const existing = await getSongByIdService(id);

        if (!existing) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Song not found' });
            return;
        }

        await updateSongById(id, req.body);
        const updated = await getSongByIdService(id);

        res.status(HTTP_STATUS.OK).json(updated);
    } catch (error) {
        next(error);
    }
};


/**
 * Deletes a song by ID.
 * Checks existence before deleting to return a proper 404 instead of a DB error.
 * @param req - Express request object containing `id` in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response confirming deletion or 404 if not found
 */
export const deleteSong = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const existing = await getSongByIdService(id); 

        if (!existing) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Song not found' });
            return;
        }

        await deleteSongById(id);
        res.status(HTTP_STATUS.OK).json({ message: `${id} was deleted` });
    } catch (error) {
        next(error);
    }
};


/**
 * Handles uploading a media file (MP3, M4A, MP4) and linking it to an existing song.
 *
 * Validation:
 * Multer fileFilter checks extension and MIME type before saving
 * Song existence check ensures the target song exists before processing
 * Magic bytes check reads actual file contents to prevent spoofed files
 * DB update links the file path to the song record
 *
 * The uploaded file is deleted from disk if any validation or DB step fails,
 * preventing orphaned files from accumulating in the uploads folder.
 *
 * @param req - Express request object containing `file` from Multer and `songId` in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with upload details or appropriate error
 */
export const uploadSongFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "No file uploaded" });
            return;
        }

        const songId = req.body.songId;

        if (!songId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "songId is required" });
            return;
        }

        const existingSong = await getSongByIdService(songId);

        if (!existingSong) {
            fs.unlinkSync(req.file.path);
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Song not found" });
            return;
        }

        const realType = await fromFile(req.file.path);
        const allowedMimes = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "video/mp4"];

        if (!realType || !allowedMimes.includes(realType.mime)) {
            fs.unlinkSync(req.file.path);
            return next(new AppError("File contents do not match an allowed type", "INVALID_FILE", HTTP_STATUS.BAD_REQUEST));
        }

        const filePath = `http://localhost:3000/uploads/${req.file.filename}`;

        try {
            await updateSongById(songId, { filePath } as any);
        } catch (error) {
            fs.unlinkSync(req.file.path);
            return next(new AppError("Failed to link file to song, upload cancelled", "DB_ERROR", HTTP_STATUS.INTERNAL_SERVER_ERROR));
        }

        res.status(HTTP_STATUS.CREATED).json({
            message: "File uploaded and linked to song",
            data: {
                songId,
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
                path: filePath
            }
        });
    } catch (error) {
        next(error);
    }
};