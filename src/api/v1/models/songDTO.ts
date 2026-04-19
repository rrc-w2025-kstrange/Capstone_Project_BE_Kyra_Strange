export interface SongDTO {
    id: string | undefined;
    title: string | undefined;
    albumId: string | undefined;    
    duration: number | undefined;
    filePath?: string | undefined;   
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
