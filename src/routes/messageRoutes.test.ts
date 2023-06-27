import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import { createApp } from "../app";
import request from "supertest";
import { connectDB, disconnectDB } from "../database";

const app = createApp();

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await disconnectDB();
});

describe("POST /message", () => {
    it("should save a message and respond with 200", async () => {
        // Arrange
        const mockMessage = {
            name: "John Doe",
            email: "john.doe@example.com",
            message: "Hello world",
        };

        // Act
        const response = await request(app).post("/message").send(mockMessage);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Message was saved successfully.",
        });
    });
});
