import { Request, Response } from "express";
import { getAllAlbumsService, getAlbumByIdService, createNewAlbum, updateAlbumById, deleteAlbumById } from "../services/albumsService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateAlbumRequest } from "../models/createAlbumRequestModel";

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

export const updateAlbum = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        await updateAlbumById(id, req.body);
        const updated = await getAlbumByIdService(id);

        if (!updated) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Album not found' });
        }

        return res.status(HTTP_STATUS.OK).json(updated);
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const deleteAlbum = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await deleteAlbumById(id);
        res.status(HTTP_STATUS.OK).json({ message: `${id} was deleted` });
    } catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Album not found' });
    }
};
