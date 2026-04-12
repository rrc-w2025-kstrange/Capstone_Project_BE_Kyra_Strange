import multer from "multer";
import path from "path";

// Where files are saved and what they are named
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");            // files will be saved in an /uploads folder
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));  
    }
});

// Validate file type and size
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [".mp3", ".wav", ".aac"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);         
    } else {
        cb(new Error("Only MP3, WAV, and AAC files are allowed"));  
    }
};

// Export the configured upload handler
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB max
});

export default upload;