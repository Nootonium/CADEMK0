import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import Message from "../models/message";
import { validateMessage, saveMessage, respondWithGpt } from "./messageService";
import * as emailService from "./emailService";
import * as gptService from "./gptService";
import { connectDB, disconnectDB } from "../database";
import { createApp } from "../app";

// Mock the Message model
jest.mock("../models/message");
jest.mock("./gptService");
jest.mock("./emailService");

const app = createApp();

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await disconnectDB();
});

describe("POST /message - Message Validation", () => {
    it("should fail when name is undefined", async () => {
        const res = await request(app).post("/message").send({
            email: "test@example.com",
            message: "Hello, world!",
        });
        expect(res.status).toEqual(400);
        expect(res.body.errors).toContain("Name is required");
    });

    it("should fail when name is an empty string", async () => {
        const res = await request(app).post("/message").send({
            name: "",
            email: "test@example.com",
            message: "Hello, world!",
        });
        expect(res.status).toEqual(400);
        expect(res.body.errors).toContain("Name is required");
    });

    it("should fail when email is undefined", async () => {
        const res = await request(app).post("/message").send({
            name: "John Doe",
            message: "Hello, world!",
        });
        expect(res.status).toEqual(400);
        expect(res.body.errors).toContain("Must be a valid email");
    });

    it("should fail when email is an empty string", async () => {
        const res = await request(app).post("/message").send({
            name: "John Doe",
            email: "",
            message: "Hello, world!",
        });
        expect(res.status).toEqual(400);
        expect(res.body.errors).toContain("Must be a valid email");
    });

    it("should fail when message is undefined", async () => {
        const res = await request(app).post("/message").send({
            name: "John Doe",
            email: "john.doe@example.com",
        });
        expect(res.status).toEqual(400);
        expect(res.body.errors).toContain("Message is required");
    });

    it("should fail when message is an empty string", async () => {
        const res = await request(app).post("/message").send({
            name: "John Doe",
            email: "john.doe@example.com",
            message: "",
        });
        expect(res.status).toEqual(400);
        expect(res.body.errors).toContain("Message is required");
    });

    it("should call next when data is valid", () => {
        const mockReq = {
            body: {
                name: "John Doe",
                email: "john@example.com",
                message: "Hello, world!",
            },
        } as Request;
        const mockRes = {} as Response;
        const mockNext = jest.fn();

        validateMessage(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe("POST /message - Save Message", () => {
    it("should save the message and call next", async () => {
        const mockReq = {
            body: {
                name: "John Doe",
                email: "john.doe@example.com",
                message: "Hello, world!",
            },
        } as Request;

        const mockJson = jest.fn();
        const mockRes = {
            status: jest.fn().mockReturnValue({ json: mockJson }),
            locals: {},
        } as unknown as Response;

        const mockNext = jest.fn();

        const { save } = jest.mocked(Message.prototype);

        await saveMessage(mockReq, mockRes, mockNext);

        expect(Message).toHaveBeenCalledWith(mockReq.body);

        expect(save).toHaveBeenCalled();

        expect(mockRes.status).toHaveBeenCalledWith(200);

        expect(mockJson).toHaveBeenCalledWith({
            message: "Message was saved successfully.",
        });

        expect(mockNext).toHaveBeenCalled();
    });
    it("should handle database error", async () => {
        const mockReq = {
            body: {
                name: "John Doe",
                email: "john.doe@example.com",
                message: "Hello, world!",
            },
        } as Request;

        const mockSend = jest.fn();
        const mockRes = {
            status: jest.fn().mockReturnValue({ send: mockSend }),
            locals: {},
        } as unknown as Response;

        const mockNext = jest.fn();

        const { save } = jest.mocked(Message.prototype);

        save.mockRejectedValue(new Error("Database error"));

        await saveMessage(mockReq, mockRes, mockNext);

        expect(Message).toHaveBeenCalledWith(mockReq.body);

        expect(save).toHaveBeenCalled();

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockSend).toHaveBeenCalledWith("Server error");

        expect(mockNext).not.toHaveBeenCalled();
    });
    describe("POST /message Respond With Gpt", () => {
        it("should respond with GPT and send email when GPT response is valid", async () => {
            // Create a mock request with valid data
            const mockReq = {
                body: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    message: "Hello, world!",
                },
            } as Request;

            // Create a mock response with a locals property
            const mockRes = {
                locals: {
                    savedMessage: {
                        responded: false,
                        category: "",
                        save: jest.fn(),
                    },
                },
            } as unknown as Response;

            // Use jest.spyOn to get the mocked functions from gptService and emailService modules
            const getGptResponseSpy = jest.spyOn(gptService, "getGptResponse");
            const validateGPTResponseSpy = jest.spyOn(
                gptService,
                "validateGPTResponse"
            );
            const parseGptResponseSpy = jest.spyOn(gptService, "parseGptResponse");
            const buildEmailBodySpy = jest.spyOn(emailService, "buildEmailBody");
            const sendEmailSpy = jest.spyOn(emailService, "sendEmail");

            // Mock the return values of the mocked functions
            getGptResponseSpy.mockResolvedValue("Some GPT response");
            validateGPTResponseSpy.mockReturnValue(true);
            parseGptResponseSpy.mockReturnValue({
                inquiryType: "General",
                response: "Thank you for your message.",
            });
            buildEmailBodySpy.mockReturnValue("Some email body");
            sendEmailSpy.mockResolvedValue(true);

            // Call the respondWithGpt function with the mock request and response
            await respondWithGpt(mockReq, mockRes);

            // Expect the getGptResponse function to be called with the name and message from the request body
            expect(getGptResponseSpy).toHaveBeenCalledWith({
                name: mockReq.body.name,
                message: mockReq.body.message,
            });

            // Expect the validateGPTResponse function to be called with the GPT response
            expect(validateGPTResponseSpy).toHaveBeenCalledWith("Some GPT response");

            // Expect the parseGptResponse function to be called with the GPT response
            expect(parseGptResponseSpy).toHaveBeenCalledWith("Some GPT response");

            // Expect the buildEmailBody function to be called with the name and response from the parsed GPT response
            expect(buildEmailBodySpy).toHaveBeenCalledWith({
                name: mockReq.body.name,
                response: "Thank you for your message.",
            });

            // Expect the sendEmail function to be called with the email, subject and body
            expect(sendEmailSpy).toHaveBeenCalledWith({
                to: mockReq.body.email,
                subject: "General",
                body: "Some email body",
            });

            // Expect the savedMessage object to have responded set to true and category set to inquiryType
            expect(mockRes.locals.savedMessage.responded).toBe(true);
            expect(mockRes.locals.savedMessage.category).toBe("General");

            // Expect the save method on the savedMessage object to be called
            expect(mockRes.locals.savedMessage.save).toHaveBeenCalled();
        });
    });
});
