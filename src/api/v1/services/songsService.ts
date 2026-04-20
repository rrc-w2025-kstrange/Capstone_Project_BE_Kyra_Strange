import { getAllSongs, getSongById, addSong, updateSong, deleteSong } from "../repositories/songsRepository";
import { getAlbumById } from "../repositories/albumsRepository";
import { CreateSongRequest } from "../models/createSongRequestModel";
import { SongDTO } from "../models/songDTO";

/**
 * Retrieves all songs from the repository.
 * @returns Array of SongDTO objects or undefined if none exist
 */
export const getAllSongsService = async (): Promise<Array<SongDTO> | undefined> => {
    return await getAllSongs();
};


/**
 * Retrieves a single song by its ID.
 * @param id - The unique song ID (e.g. "song_001")
 * @returns The matching SongDTO or undefined if not found
 */
export const getSongByIdService = async (id: string): Promise<SongDTO | undefined> => {
    return await getSongById(id);
};


/**
 * Creates a new song after verifying the referenced album exists.
 * @param song: The song data to create
 * @returns The created SongDTO
 * @throws Error if the referenced album does not exist
 */
export const createNewSong = async (song: CreateSongRequest): Promise<SongDTO> => {
    const albumExists = await getAlbumById(song.albumId);  

    if (!albumExists) {                                     
        throw new Error("Album not found");                 
    } 
    
    return await addSong(song);
};


/**
 * Updates an existing song by ID.
 * @param id: The unique song ID to update
 * @param song: The fields to update on the song
 * @returns void
 */
export const updateSongById = async (id: string, song: CreateSongRequest): Promise<void> => {
    await updateSong(id, song);
};


/**
 * Deletes a song by ID after verifying it exists.
 * @param id: The unique song ID to delete
 * @returns void
 * @throws Error if the song does not exist
 */
export const deleteSongById = async (id: string): Promise<void> => {
    const existing = await getSongById(id);
    if (!existing) {
        throw new Error("Not Found");
    }
    await deleteSong(id);
};
