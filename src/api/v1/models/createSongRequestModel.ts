export interface CreateSongRequest {
    title: string;
    albumId: string;
    duration?: number;
    filePath?: string;
}
