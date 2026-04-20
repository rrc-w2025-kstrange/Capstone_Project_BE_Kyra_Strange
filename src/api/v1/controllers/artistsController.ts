import { Request, Response, NextFunction } from "express";
import { getAllArtistsService, getArtistByIdService, createNewArtist, updateArtistById, deleteArtistById } from "../services/artistsService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { CreateArtistRequest } from "../models/createArtistRequestModel";


/**
 * Retrieves all artists from the database ordered by creation date.
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with all artists and total count
 */
export const getAllArtists = async (req: Request, res: Response) => {
    try {
        const artists = await getAllArtistsService();

        res.status(HTTP_STATUS.OK).json({
            message: "Artists retrieved",
            count: artists?.length || 0,
            data: artists
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: "Internal Server Error" 
        });
    }
}


/**
 * Retrieves a single artist by their ID.
 * Checks for a valid id field on the result since getArtistByIdService
 * always returns an object — an empty id indicates the artist was not found.
 * @param req - Express request object containing `id` in params
 * @param res - Express response object
 * @returns JSON response with the artist data or 404 if not found
 */
export const getArtistById = async (req: Request, res: Response) => {
    try {
        let id = req.params.id;
        let results = await getArtistByIdService(id);
        
        if (!results.id) {                                                        
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Artist not found" });
            return;   
        } 

        res.status(HTTP_STATUS.OK).json(successResponse(results, "Artist retrieved"));
    } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}


/**
 * Creates a new artist with the provided data.
 * Status defaults to "active" and category defaults to "general" if not provided.
 * @param req - Express request object containing artist data in body
 * @param res - Express response object
 * @returns JSON response with the created artist or 500 on failure
 */
export const createArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await createNewArtist(req.body as CreateArtistRequest);

        res.status(HTTP_STATUS.CREATED).json({
            message: "Artist created", 
            data: result            
        });
    } catch (error: any) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: "Failed to create Artist" 
        });
    }
};


/**
 * Updates an existing artist by ID.
 * Checks existence before updating to return a proper 404 instead of a DB error.
 * @param req - Express request object containing `id` in params and update fields in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with the updated artist or 404 if not found
 */
export const updateArtist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id: string = req.params.id;

        const existing = await getArtistByIdService(id);

        if (!existing.id) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Artist not found" });
            return;
        }

        await updateArtistById(id, req.body);
        const updated = await getArtistByIdService(id);

        res.status(HTTP_STATUS.OK).json(updated);
    } catch (error) {
        next(error);
    }
};


/**
 * Deletes an artist by ID.
 * @param req - Express request object containing `id` in params
 * @param res - Express response object
 * @returns JSON response confirming deletion or 404 if not found
 */
export const deleteArtist = async (req: Request, res: Response) => {
    try {
        let id: string = req.params.id;
        await deleteArtistById(id); 
        
        res.status(HTTP_STATUS.OK).json({ message: `${id} was deleted` });
    } catch (error: any) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ 
            message: "Artist not found" 
        });
    }
};