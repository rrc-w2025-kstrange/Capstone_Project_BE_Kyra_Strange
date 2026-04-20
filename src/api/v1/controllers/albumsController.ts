import { Request, Response, NextFunction } from "express";
import { getAllAlbumsService, getAlbumByIdService, createNewAlbum, updateAlbumById, deleteAlbumById } from "../services/albumsService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateAlbumRequest } from "../models/createAlbumRequestModel";


/**
 * Retrieves all albums from the database ordered by creation date.
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with all albums and total count
 */
export const getAllAlbums = async (req: Request, res: Response) => {
    try {
        const albums = await getAllAlbumsService();
        res.status(HTTP_STATUS.OK).json({
            message: "Albums retrieved",
            count: albums?.length || 0,
            data: albums
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error"
        });
    }
};


/**
 * Retrieves a single album by its ID.
 * @param req - Express request object containing `id` in params
 * @param res - Express response object
 * @returns JSON response with the album data or 404 if not found
 */
export const getAlbumById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await getAlbumByIdService(id);

        if (!result) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Album not found' });
            return;
        }

        res.status(HTTP_STATUS.OK).json({ message: 'Album retrieved', data: result });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error"
        });
    }
};


/**
 * Creates a new album linked to an existing artist.
 * Genre defaults to "general" if not provided.
 * @param req - Express request object containing album data in body
 * @param res - Express response object
 * @returns JSON response with the created album, 404 if artist not found, or 500 on failure
 */
export const createAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await createNewAlbum(req.body as CreateAlbumRequest);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Album created",
            data: result
        });
    } catch (error: any) {
        if (error.message === "Artist not found") {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Artist not found" });
            return;
        }
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Failed to create Album" });
    }
};


/**
 * Updates an existing album by ID.
 * Checks existence before updating to return a proper 404 instead of a DB error.
 * @param req - Express request object containing `id` in params and update fields in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with the updated album or 404 if not found
 */
export const updateAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id;

        const existing = await getAlbumByIdService(id);

        if (!existing) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Album not found" });
            return;
        }

        await updateAlbumById(id, req.body);
        const updated = await getAlbumByIdService(id);

        res.status(HTTP_STATUS.OK).json(updated);
    } catch (error) {
        next(error);
    }
};


/**
 * Deletes an album by ID.
 * @param req - Express request object containing `id` in params
 * @param res - Express response object
 * @returns JSON response confirming deletion or 404 if not found
 */
export const deleteAlbum = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await deleteAlbumById(id);
        res.status(HTTP_STATUS.OK).json({ message: `${id} was deleted` });
    } catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Album not found' });
    }
};
