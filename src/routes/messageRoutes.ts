import { check } from "express-validator";
import { validateMessage, saveMessage } from "../services/messageService";

import express from "express";

const router = express.Router();

router.post("/message", [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Must be a valid email"),
    check("message").notEmpty().withMessage("Message is required"),
    validateMessage,
    saveMessage,
]);

export default router;
