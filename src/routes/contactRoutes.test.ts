import request from "supertest";
import { createApp } from "../app";
import { connectDB, disconnectDB } from "../database";

const app = createApp();

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await disconnectDB();
});

describe("POST /contact", () => {
    it("should accept and save message with valid data", async () => {
        const res = await request(app).post("/contact").send({
            name: "John Doe",
            email: "john@example.com",
            message: "Hello there!",
        });

        expect(res.status).toBe(200);
    });

    it("should reject an invalid email", async () => {
        const res = await request(app).post("/contact").send({
            name: "John Doe",
            email: "notanemail",
            message: "Hello there!",
        });

        expect(res.status).toBe(400);
    });

    it("should reject an empty name", async () => {
        const res = await request(app).post("/contact").send({
            name: "",
            email: "john@example.com",
            message: "Hello there!",
        });

        expect(res.status).toBe(400);
    });

    it("should reject an empty message", async () => {
        const res = await request(app).post("/contact").send({
            name: "John Doe",
            email: "john@example.com",
            message: "",
        });

        expect(res.status).toBe(400);
    });
});
