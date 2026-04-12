import { getAllAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum } from "../repositories/albumsRepository";
import { getArtistById } from "../repositories/artistsRepository";
import { CreateAlbumRequest } from "../models/createAlbumRequestModel";
import { AlbumDTO } from "../models/albumDTO";

export const getAllAlbumsService = async (): Promise<Array<AlbumDTO> | undefined> => {
    return await getAllAlbums();
};

export const getAlbumByIdService = async (id: string): Promise<AlbumDTO | undefined> => {
    return await getAlbumById(id);
};

export const createNewAlbum = async (album: CreateAlbumRequest): Promise<AlbumDTO> => {
    const artistExists = await getArtistById(album.artistId);

    if (!artistExists) {                                       
        throw new Error("Artist not found");                   
    }  
    
    return await addAlbum(album);
};

export const updateAlbumById = async (id: string, album: CreateAlbumRequest): Promise<void> => {
    await updateAlbum(id, album);
};

export const deleteAlbumById = async (id: string): Promise<void> => {
    const existing = await getAlbumById(id);
    if (!existing) {
        throw new Error("Not Found");
    }
    await deleteAlbum(id);
};
