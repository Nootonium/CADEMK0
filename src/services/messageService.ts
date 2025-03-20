import Message from "../models/Message";
import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { eventEmitter } from "../events";

export async function validateMessage(req: Request, res: Response, next: NextFunction) {
    /**
     * This function validates the request body and checks if the name, email, and message fields are present.
     */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    next();
}

export async function saveMessage(req: Request, res: Response) {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    try {
        await newMessage.save();
        res.status(200).json({ message: "Message was saved successfully." });
        eventEmitter.emit("messageSaved", newMessage);
    } catch (err) {
        const error = err as Error;
        logger.error(error.message);
        res.status(500).send("Server error");
    }
}
