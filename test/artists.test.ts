import request from "supertest";
import express from "express";
import artistsRoutes from "../src/api/v1/routes/artistsRoutes";

const app = express();
app.use(express.json());
app.use("/api/v1/artists", artistsRoutes);

describe("Artists API", () => {

    it("GET /artists - should return all artists", async () => {
        const res = await request(app).get("/api/v1/artists");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
    });

    it("POST /artists - should create artist", async () => {
        const res = await request(app)
            .post("/api/v1/artists")
            .send({
                name: "Test Artist",
                status: "active",
                category: "solo"
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("data");
    });

    it("GET /artists/:id - should return 404 if not found", async () => {
        const res = await request(app).get("/api/v1/artists/invalid_id");

        expect(res.status).toBe(404);
    });

    it("PUT /artists/:id - should return 404 if not found", async () => {
        const res = await request(app)
            .put("/api/v1/artists/invalid_id")
            .send({ name: "Updated" });

        expect(res.status).toBe(404);
    });

    it("DELETE /artists/:id - should return 404 if not found", async () => {
        const res = await request(app)
            .delete("/api/v1/artists/invalid_id");

        expect(res.status).toBe(404);
    });

});