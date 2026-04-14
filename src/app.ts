import express, { Express } from "express";
import morgan from "morgan";
import artistsRoutes from "./api/v1/routes/artistsRoutes";
import albumsRoutes from './api/v1/routes/albumsRoutes';
import songsRoutes from './api/v1/routes/songsRoutes';

// Initialize Express application
const app: Express = express();

app.use(morgan("combined"));

app.use(express.json());

// Route handler
app.use("/api/v1/artists", artistsRoutes); 
app.use("/api/v1/albums", albumsRoutes);
app.use("/api/v1/songs", songsRoutes);
app.use("/uploads", express.static("uploads"));

// Define a route
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

export default app;