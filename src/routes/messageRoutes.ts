import { check } from "express-validator";
import {
    saveMessage,
    validateMessage,
    respondWithGpt,
} from "../services/messageService";
import express from "express";

const router = express.Router();

router.post("/message", [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Must be a valid email"),
    check("message").notEmpty().withMessage("Message is required"),
    validateMessage,
    saveMessage,
    respondWithGpt,
]);

export default router;
