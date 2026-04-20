import { db } from "../../../config/firebaseConfig";
import { DocumentReference, QuerySnapshot } from "firebase-admin/firestore";
import { AlbumDTO } from "../models/albumDTO";
import { CreateAlbumRequest } from "../models/createAlbumRequestModel";


/**
 * Retrieves all albums from Firestore ordered by creation date ascending.
 * @returns Array of AlbumDTO objects, or an empty array if an error occurs
 */
export const getAllAlbums = async (): Promise<Array<AlbumDTO> | undefined> => {
    try {
        const snapshot: QuerySnapshot = await db.collection("Albums").orderBy("createdAt", "asc").get();
        const albums: AlbumDTO[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            albums.push({
                id: doc.id,
                title: data.title,
                artistId: data.artistId,
                releaseYear: data.releaseYear,
                genre: data.genre,
                createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
                updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
            });
        });
        return albums;
    } catch (error) {
        console.error("Repository Error in getAllAlbums:", error);
        return [];
    }
};


/**
 * Retrieves a single album from Firestore by its document ID.
 * @param id - The Firestore document ID of the album (e.g. "album_001")
 * @returns The matching AlbumDTO or undefined if the document does not exist
 */
export const getAlbumById = async (id: string): Promise<AlbumDTO | undefined> => {
    const docRef: DocumentReference = db.collection("Albums").doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
        const data = doc.data();
        return {
            id: doc.id,
            title: data!.title,
            artistId: data!.artistId,
            releaseYear: data!.releaseYear,
            genre: data!.genre,
            createdAt: data!.createdAt.toDate().toISOString(),
            updatedAt: data!.updatedAt.toDate().toISOString(),
        } as AlbumDTO;
    } else {
        console.log("No such album!");
    }
};


/**
 * Adds a new album to Firestore using a transaction to generate a sequential custom ID.
 *
 * Uses a counter document in the "metadata" collection to track the next ID.
 * The transaction ensures the counter and the new album document are written atomically,
 * preventing duplicate IDs if multiple requests arrive simultaneously.
 *
 * @param album - The album data to store
 * @returns The created AlbumDTO with its generated ID and timestamps
 */
export const addAlbum = async (album: CreateAlbumRequest): Promise<AlbumDTO> => {
    const counterRef = db.collection("metadata").doc("albumsCounter");
    const albumsCollection = db.collection("Albums");

    return await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const currentCount = counterDoc.exists ? counterDoc.data()?.count : 0;
        const nextCount = currentCount + 1;
        const customId = `album_${nextCount.toString().padStart(3, "0")}`;
        const docRef = albumsCollection.doc(customId);

        const albumEntity: AlbumDTO = {
            id: customId,
            title: album.title,
            artistId: album.artistId,
            releaseYear: album.releaseYear,
            genre: album.genre ?? "general",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        transaction.set(docRef, albumEntity);
        transaction.set(counterRef, { count: nextCount });
        return albumEntity;
    });
};


/**
 * Updates an existing album document in Firestore.
 * @param id - The Firestore document ID of the album to update
 * @param album - The fields to update
 * @returns void
 */
export const updateAlbum = async (id: string, album: CreateAlbumRequest): Promise<void> => {
    const docRef: DocumentReference = db.collection("Albums").doc(id);
    await docRef.update({
        title: album.title,
        artistId: album.artistId,
        releaseYear: album.releaseYear,
        genre: album.genre,
        updatedAt: new Date(),
    });
};


/**
 * Deletes an album document from Firestore by its ID.
 * @param id - The Firestore document ID of the album to delete
 * @returns void
 */
export const deleteAlbum = async (id: string): Promise<void> => {
    const docRef: DocumentReference = db.collection("Albums").doc(id);
    await docRef.delete();
};
