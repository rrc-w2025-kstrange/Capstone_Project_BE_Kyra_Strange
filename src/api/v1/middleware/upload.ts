import multer from "multer";
import path from "path";

// Where files are saved and what they are named
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");            // files will be saved in an /uploads folder
    },
    filename: (req, file, cb) => {
        const unique = Date.now();
        const safeName = file.originalname
            .replace(/\s+/g, "-")     
            .replace(/[^\w.-]/g, "");

        cb(null, `${unique}-${safeName}`);
}});

// Validate file type and size
const allowedMimeTypes = {
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".mp4": "video/mp4",
};

const fileSizeLimits = {
    ".mp3": 10 * 1024 * 1024,
    ".m4a": 10 * 1024 * 1024,
    ".mp4": 100 * 1024 * 1024,
};

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

// Combines storage and fileFilter into one final configuration and adds a size limit
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }  
});

export default upload;