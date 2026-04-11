import { getAllSongs, getSongById, addSong, updateSong, deleteSong } from "../repositories/songsRepository";
import { CreateSongRequest } from "../models/createSongRequestModel";
import { SongDTO } from "../models/songDTO";

export const getAllSongsService = async (): Promise<Array<SongDTO> | undefined> => {
    return await getAllSongs();
};

export const getSongByIdService = async (id: string): Promise<SongDTO | undefined> => {
    return await getSongById(id);
};

export const createNewSong = async (song: CreateSongRequest): Promise<SongDTO> => {
    return await addSong(song);
};


export const updateSongById = async (id: string, song: CreateSongRequest): Promise<void> => {
    await updateSong(id, song);
};

export const deleteSongById = async (id: string): Promise<void> => {
    const existing = await getSongById(id);
    if (!existing) {
        throw new Error("Not Found");
    }
    await deleteSong(id);
};
