import express, { Express } from "express";
import artistsRoutes from "./api/v1/routes/artistsRoutes";
import albumsRoutes from './api/v1/routes/albumsRoutes';
import songsRoutes from './api/v1/routes/songsRoutes';
import setupSwagger from "./config/swagger";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import adminRoutes from "./api/v1/routes/adminRoutes";
import authRoutes from "./api/v1/routes/authRoutes";

// Initialize Express application
const app: Express = express();

// Logging middleware 
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

app.use(express.json());

// Route handler
app.use("/api/v1/artists", artistsRoutes); 
app.use("/api/v1/albums", albumsRoutes);
app.use("/api/v1/songs", songsRoutes);
app.use("/uploads", express.static("uploads", {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith(".mp4")) {
            res.setHeader("Content-Type", "video/mp4");
        }
    }
}));
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);

// Define a route
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

setupSwagger(app);

// Global error handling middleware
app.use(errorHandler);

export default app;