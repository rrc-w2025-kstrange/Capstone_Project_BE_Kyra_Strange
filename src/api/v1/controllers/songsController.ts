import { Request, Response } from "express";
import { getAllSongsService, getSongByIdService, createNewSong, updateSongById, deleteSongById } from "../services/songsService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateSongRequest } from "../models/createSongRequestModel";

export const getAllSongs = async (req: Request, res: Response) => {
    try {
        const songs = await getAllSongsService();
        res.status(HTTP_STATUS.OK).json({
            message: "Songs retrieved",
            count: songs?.length || 0,
            data: songs
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error"
        });
    }
};

export const getSongById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await getSongByIdService(id);

        if (!result) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Song not found' });
            return;
        }

        res.status(HTTP_STATUS.OK).json({ message: 'Song retrieved', data: result });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error"
        });
    }
};

export const createSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await createNewSong(req.body as CreateSongRequest);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Song created",
            data: result
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create Song"
        });
    }
};

export const updateSong = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        await updateSongById(id, req.body);
        const updated = await getSongByIdService(id);

        if (!updated) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Song not found' });
        }

        return res.status(HTTP_STATUS.OK).json(updated);
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

export const deleteSong = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await deleteSongById(id);
        res.status(HTTP_STATUS.OK).json({ message: `${id} was deleted` });
    } catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Song not found' });
    }
};


export const uploadSongFile = async (req: Request, res: Response): Promise<void> => {
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

        const filePath = `http://localhost:3000/uploads/${req.file.filename}`;  

        await updateSongById(songId, { filePath } as any);

        // req.file is provided by Multer, it contains info about the uploaded file
        res.status(HTTP_STATUS.CREATED).json({
            message: "File uploaded and linked to song",
            data: {
                songId,
                filename: req.file.filename,      
                originalname: req.file.originalname, 
                size: req.file.size,               
                path: `http://localhost:3000/uploads/${req.file.filename}`                
            }
        });
    } catch (error: any) {
        if (error.message?.includes("Only MP3")) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
            return;
        }
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Upload failed" });
    }
};