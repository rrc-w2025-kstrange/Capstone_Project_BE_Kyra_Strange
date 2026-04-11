export interface AlbumDTO {
    id: string | undefined;
    title: string | undefined;
    artistId: string | undefined;   
    releaseYear: number | undefined;
    genre: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
