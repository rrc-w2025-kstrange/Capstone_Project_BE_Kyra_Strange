import { db } from "../../../config/firebaseConfig";
import { DocumentReference, QuerySnapshot } from "firebase-admin/firestore";
import { SongDTO } from "../models/songDTO";
import { CreateSongRequest } from "../models/createSongRequestModel";


export const getAllSongs = async (): Promise<Array<SongDTO> | undefined> => {
    try {
        const snapshot: QuerySnapshot = await db.collection("Songs").orderBy("createdAt", "asc").get();
        const songs: SongDTO[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            songs.push({
                id: doc.id,
                title: data.title,
                albumId: data.albumId,
                duration: data.duration,
                filePath: data.filePath,
                createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
                updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
            });
        });
        return songs;
    } catch (error) {
        console.error("Repository Error in getAllSongs:", error);
        return [];
    }
};


export const getSongById = async (id: string): Promise<SongDTO | undefined> => {
    const docRef: DocumentReference = db.collection("Songs").doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
        const data = doc.data();
        return {
            id: doc.id,
            title: data!.title,
            albumId: data!.albumId,
            duration: data!.duration,
            createdAt: data!.createdAt.toDate().toISOString(),
            updatedAt: data!.updatedAt.toDate().toISOString(),
        } as SongDTO;
    } else {
        console.log("No such song!");
    }
};


export const addSong = async (song: CreateSongRequest): Promise<SongDTO> => {
    const counterRef = db.collection("metadata").doc("songsCounter");
    const songsCollection = db.collection("Songs");

    return await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const currentCount = counterDoc.exists ? counterDoc.data()?.count : 0;
        const nextCount = currentCount + 1;
        const customId = `song_${nextCount.toString().padStart(3, "0")}`;
        const docRef = songsCollection.doc(customId);

        const songEntity: SongDTO = {
            id: customId,
            title: song.title,
            albumId: song.albumId,
            duration: song.duration,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        transaction.set(docRef, songEntity);
        transaction.set(counterRef, { count: nextCount });
        return songEntity;
    });
};


export const updateSong = async (id: string, song: CreateSongRequest): Promise<void> => {
    const docRef: DocumentReference = db.collection("Songs").doc(id);
    const updateData: any = {
        title: song.title,
        albumId: song.albumId,
        duration: song.duration,
        updatedAt: new Date(),
    };

    if (song.filePath) {
        updateData.filePath = song.filePath;  // only added if it exists
    }

    await docRef.update(updateData);
};


export const deleteSong = async (id: string): Promise<void> => {
    const docRef: DocumentReference = db.collection("Songs").doc(id);
    await docRef.delete();
};
