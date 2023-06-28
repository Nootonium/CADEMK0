import Message from "../models/message";
import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Message as IMessage } from "../types";
import { getValidatedResponse } from "./openAiService";
import { buildEmailBody, sendEmail } from "./emailService";

export async function validateMessage(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    next();
}

export async function saveMessage(req: Request, res: Response, next: NextFunction) {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });

    try {
        await newMessage.save();
        res.locals.savedMessage = newMessage;
        res.status(200).json({ message: "Message was saved successfully." });
        next();
    } catch (err) {
        const error = err as Error;
        logger.error(error.message);
        res.status(500).send("Server error");
        return;
    }
}

export async function respondWithGpt(req: Request, res: Response) {
    const { name, email, message } = req.body;
    const savedMessage: IMessage = res.locals.savedMessage;
    const gptResponse = await getValidatedResponse({ name, message });

    const emailBody = buildEmailBody({
        name,
        response: gptResponse.response,
    });
    const emailSent = await sendEmail({
        to: email,
        subject: gptResponse.inquiryType,
        body: emailBody,
    });
    if (emailSent) {
        savedMessage.responded = true;
        savedMessage.category = gptResponse.inquiryType;
        savedMessage.save();
    }
}
