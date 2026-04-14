import multer from "multer";
import path from "path";

// Where files are saved and what they are named
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");            // files will be saved in an /uploads folder
    },
    filename: (req, file, cb) => {
        const unique = Date.now().toString().slice(-4); 
        cb(null, unique + "-" + file.originalname);  
    }
});

// Validate file type and size
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [".mp3", ".m4a", ".mp4"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);         
    } else {
        cb(new Error("Only MP3, m4a, and MP4 files are allowed"));  
    }
};

// Combines storage and fileFilter into one final configuration and adds a size limit
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB max
});

export default upload;