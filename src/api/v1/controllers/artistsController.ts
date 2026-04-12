import { Request, Response } from "express";
import { getAllArtistsService, getArtistByIdService, createNewArtist, updateArtistById, deleteArtistById } from "../services/artistsService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { CreateArtistRequest } from "../models/createArtistRequestModel";


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

export const updateArtist = async (req: Request, res: Response): Promise<any> => {
    try {
        const id: string = req.params.id;
        const updateArtist = req.body;

        await updateArtistById(id, updateArtist);

        const updatedupdateArtist = await getArtistByIdService(id);

        if (!updatedupdateArtist) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Artist not found" });
        }

        return res.status(HTTP_STATUS.OK).json(updatedupdateArtist);
        
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

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