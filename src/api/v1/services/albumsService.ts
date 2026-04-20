import { getAllAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum } from "../repositories/albumsRepository";
import { getArtistById } from "../repositories/artistsRepository";
import { CreateAlbumRequest } from "../models/createAlbumRequestModel";
import { AlbumDTO } from "../models/albumDTO";


/**
 * Retrieves all albums from the repository.
 * @returns Array of AlbumDTO objects or undefined if none exist
 */
export const getAllAlbumsService = async (): Promise<Array<AlbumDTO> | undefined> => {
    return await getAllAlbums();
};


/**
 * Retrieves a single album by its ID.
 * @param id - The unique album ID (e.g. "album_001")
 * @returns The matching AlbumDTO or undefined if not found
 */
export const getAlbumByIdService = async (id: string): Promise<AlbumDTO | undefined> => {
    return await getAlbumById(id);
};


/**
 * Creates a new album after verifying the referenced artist exists.
 * @param album: The album data to create
 * @returns The created AlbumDTO
 * @throws Error if the referenced artist does not exist
 */
export const createNewAlbum = async (album: CreateAlbumRequest): Promise<AlbumDTO> => {
    const artistExists = await getArtistById(album.artistId);

    if (!artistExists) {                                       
        throw new Error("Artist not found");                   
    }  
    
    return await addAlbum(album);
};


/**
 * Updates an existing album by ID.
 * @param id - The unique album ID to update
 * @param album - The fields to update on the album
 * @returns void
 */
export const updateAlbumById = async (id: string, album: CreateAlbumRequest): Promise<void> => {
    await updateAlbum(id, album);
};


/**
 * Deletes an album by ID after verifying it exists.
 * @param id - The unique album ID to delete
 * @returns void
 * @throws Error if the album does not exist
 */
export const deleteAlbumById = async (id: string): Promise<void> => {
    const existing = await getAlbumById(id);
    if (!existing) {
        throw new Error("Not Found");
    }
    await deleteAlbum(id);
};
