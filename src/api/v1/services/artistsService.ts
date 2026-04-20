import { addArtist, getArtistById, updateArtist, getAllArtists, deleteArtist } from "../repositories/artistsRepository";
// import { validateRequest } from "../middleware/validate";
import { CreateArtistRequest } from "../models/createArtistRequestModel";
import { ArtistDTO } from "../models/artistDTO";


/**
 * Retrieves all artists from the repository.
 * @returns Array of ArtistDTO objects or undefined if none exist
 */
export const getAllArtistsService = async (): Promise<Array<ArtistDTO> | undefined> => {
    // Logic to process all items from the database
    return await getAllArtists();
};


/**
 * Retrieves a single artist by their ID and maps the result to an ArtistDTO.
 * @param id: The unique artist ID (e.g. "artist_001")
 * @returns The matching ArtistDTO with all fields mapped
 */
export const getArtistByIdService = async (id: string): Promise<ArtistDTO> => {
    // Logic to process all items from the database
    let entity = await getArtistById(id)
    return {
        id: entity?.id,
        name: entity?.name,
        status: entity?.status,
        category: entity?.category,
        createdAt: entity?.createdAt,
        updatedAt: entity?.updatedAt,
    }
};


/**
 * Creates a new artist in the repository.
 * @param artist: The artist data to create
 * @returns The created ArtistDTO
 */
export const createNewArtist = async (artist: CreateArtistRequest): Promise<ArtistDTO> => {
    return await addArtist(artist);  
};


/**
 * Updates an existing artist by ID.
 * @param id: The unique artist ID to update
 * @param artist: The fields to update on the artist
 * @returns void
 */
export const updateArtistById = async (id: string, artist: CreateArtistRequest): Promise<void> => {
    // Logic to update an item in the database
    await updateArtist(id, artist);
    return;
};


/**
 * Deletes an artist by ID after verifying they exist.
 * @param id: The unique artist ID to delete
 * @returns void
 * @throws Error if the artist does not exist
 */
export const deleteArtistById = async (id: string): Promise<void> => {
    const existing = await getArtistById(id);
    
    if (!existing) {
        throw new Error("Not Found");
    }

    await deleteArtist(id);
};