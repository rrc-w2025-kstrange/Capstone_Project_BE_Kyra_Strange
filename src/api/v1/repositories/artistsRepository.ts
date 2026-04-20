import { db } from "../../../config/firebaseConfig";
import { DocumentReference, QuerySnapshot } from "firebase-admin/firestore";
import { ArtistDTO } from "../models/artistDTO";
import { CreateArtistRequest } from "../models/createArtistRequestModel";


/**
 * Retrieves all artists from Firestore ordered by creation date ascending.
 * @returns Array of ArtistDTO objects, or an empty array if an error occurs
 */
export const getAllArtists = async (): Promise<Array<ArtistDTO> | undefined> => {
    try {
        const snapshot: QuerySnapshot = await db.collection("Artists").orderBy("createdAt", "asc").get();
        const artists: ArtistDTO[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            const formatSafeDate = (dateAny: any) => {
                if (dateAny && typeof dateAny.toDate === 'function') {
                    return dateAny.toDate().toISOString();
                }
                return new Date(dateAny).toISOString();
            };

            artists.push({
                id: doc.id,
                name: data.name,
                status: data.status,
                category: data.category,
                createdAt: formatSafeDate(data.createdAt),
                updatedAt: formatSafeDate(data.updatedAt),
            });
        });

        return artists;
    } catch (error) {
        console.error("Repository Error in getAllArtists:", error);
        return []; 
    }
};


/**
 * Adds a new artist to Firestore using a transaction to generate a sequential custom ID.
 *
 * Uses a counter document in the "metadata" collection to track the next ID.
 * The transaction ensures the counter and the new artist document are written atomically,
 * preventing duplicate IDs if multiple requests arrive simultaneously.
 *
 * @param artist - The artist data to store
 * @returns The created ArtistDTO with its generated ID and timestamps
 */
export const addArtist = async (artist: CreateArtistRequest): Promise<ArtistDTO> => {
    const counterRef = db.collection("metadata").doc("artistsCounter");
    const artistsCollection = db.collection("Artists");
    
    return await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const currentCount = counterDoc.exists ? counterDoc.data()?.count : 0;
        const nextCount = currentCount + 1;
        const customId = `artist_${nextCount.toString().padStart(3, '0')}`;
        const docRef = artistsCollection.doc(customId);

        const artistEntity: ArtistDTO = {
            id: customId,
            name: artist.name,
            status: artist.status || "active",
            category: artist.category || "general",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        transaction.set(docRef, artistEntity);
        transaction.set(counterRef, { count: nextCount });

        return artistEntity;
    });
};


/**
 * Retrieves a single artist from Firestore by their document ID.
 * @param id - The Firestore document ID of the artist (e.g. "artist_001")
 * @returns The matching ArtistDTO or undefined if the document does not exist
 */
export const getArtistById = async (id: string): Promise<ArtistDTO | undefined> => {
    const docRef: DocumentReference = db.collection("Artists").doc(id);

    // Use the `get()` method to retrieve the document
    const doc = await docRef.get();

    // Check if the document exists
    if (doc.exists) {
        // `doc.data()` returns an object with all fields in the document
        let data = doc.data();

        return {
          id: doc.id,
          name: data!.name,
          status: data!.status,
          category: data!.category,
          createdAt: data!.createdAt.toDate().toISOString(),
          updatedAt: data!.updatedAt.toDate().toISOString(),
        } as ArtistDTO;
      } else {
        console.log("No such artist!");
    }
};


/**
 * Updates an existing artist document in Firestore.
 * @param id - The Firestore document ID of the artist to update
 * @param artist - The fields to update
 * @returns void
 */
export const updateArtist = async (id: string, artist: CreateArtistRequest): Promise<void> => {
    const docRef: DocumentReference = db.collection("Artists").doc(id);

    await docRef.update({
        name: artist.name,
        status: artist.status,
        category: artist.category,
        updatedAt: new Date(),
    });
    return;
};


/**
 * Deletes an artist document from Firestore by their ID.
 * @param id - The Firestore document ID of the artist to delete
 * @returns void
 */
export const deleteArtist = async (id: string): Promise<void> => {
    const docRef: DocumentReference = db.collection("Artists").doc(id);

    await docRef.delete();
};