// import { addArtist, getArtistById, getAllArtists, updateEvent, deleteEvent } from "../repositories/firestoreRepository";
import { addArtist, getArtistById, updateArtist, getAllArtists } from "../repositories/firestoreRepository";
// import { validateRequest } from "../middleware/validate";
import { CreateArtistRequest } from "../models/createArtistRequestModel";
import { ArtistDTO } from "../models/artistDTO";



export const getAllArtistsService = async (): Promise<Array<ArtistDTO> | undefined> => {
    // Logic to process all items from the database
    return await getAllArtists();
};



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


export const createNewArtist = async (artist: CreateArtistRequest): Promise<ArtistDTO> => {
    return await addArtist(artist);  
};


export const updateArtistById = async (id: string, artist: CreateArtistRequest): Promise<void> => {
    // Logic to update an item in the database
    await updateArtist(id, artist);
    return;
};


// export const deleteArtistById = async (id: string): Promise<void> => {
//     const existing = await getArtistById(id);
    
//     if (!existing) {
//         throw new Error("Not Found");
//     }

//     await deleteArtist(id);
// };