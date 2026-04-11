import { db } from "../../../config/firebaseConfig";
import { DocumentReference, QuerySnapshot } from "firebase-admin/firestore";
import { AlbumDTO } from "../models/albumDTO";
import { CreateAlbumRequest } from "../models/createAlbumRequestModel";

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



export const deleteAlbum = async (id: string): Promise<void> => {
    const docRef: DocumentReference = db.collection("Albums").doc(id);
    await docRef.delete();
};
