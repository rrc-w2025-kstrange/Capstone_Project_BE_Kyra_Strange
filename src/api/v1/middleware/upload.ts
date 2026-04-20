import multer from "multer";
import path from "path";

/**
 * Configures where uploaded files are saved and how they are named.
 * Files are stored in the /uploads folder with a timestamp prefix
 * to ensure unique filenames and natural chronological sorting.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");         
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const safeName = file.originalname
            .replace(/\s+/g, "-")     
            .replace(/[^\w.-]/g, "");

        cb(null, `${timestamp}-${safeName}`);
}});


/**
 * Maps each allowed file extension to its expected MIME type.
 * Used as the first layer of file validation, checks both the
 * extension and the MIME type reported by the client.
 */
const allowedMimeTypes = {
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".mp4": "video/mp4",
};


/**
 * Maps each allowed file extension to its maximum allowed file size in bytes.
 * Audio files are capped at 10MB, video files at 300MB.
 */
const fileSizeLimits = {
    ".mp3": 10 * 1024 * 1024,
    ".m4a": 10 * 1024 * 1024,
    ".mp4": 300 * 1024 * 1024,
};



/**
 * Multer file filter that validates uploaded files before they are saved to disk.
 *
 * Two checks are applied:
 * Extension check: rejects files with disallowed extensions
 * MIME type check: rejects files where the MIME type doesn't match the extension
 *
 * Note: This is the first validation layer. A deeper magic bytes check is applied
 * in the controller after the file is saved, to catch spoofed files.
 *
 * @param req - Express request object
 * @param file - The file being uploaded, provided by Multer
 * @param cb - Multer callback to accept or reject the file
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const expectedMime = allowedMimeTypes[ext as keyof typeof allowedMimeTypes];

    if (!expectedMime) {
        return cb(new Error("Only .mp3, .m4a, and .mp4 files are allowed"));
    }

    if (file.mimetype !== expectedMime) {
        return cb(new Error(`File looks suspicious. Expected ${expectedMime} but got ${file.mimetype}`));
    }

    req.fileSizeLimit = fileSizeLimits[ext as keyof typeof fileSizeLimits];
    cb(null, true);
};


/**
 * Configured Multer instance combining storage, file filtering, and size limits.
 * The 300MB limit covers the largest allowed file type (MP4).
 */
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 300 * 1024 * 1024 }  
});

export default upload;