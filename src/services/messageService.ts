import Message from "../models/message";
import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getGptResponse, parseGptResponse, validateGPTResponse } from "./gptService";
import { buildEmailBody, sendEmail } from "./emailService";
import { Message as IMessage } from "../types";

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
    const gptResponse = await getGptResponse({ name, message });
    if (validateGPTResponse(gptResponse)) {
        const parsedGptResponse = parseGptResponse(gptResponse);
        const emailBody = buildEmailBody({
            name,
            response: parsedGptResponse.response,
        });
        const emailSent = await sendEmail({
            to: email,
            subject: parsedGptResponse.inquiryType,
            body: emailBody,
        });
        if (emailSent) {
            savedMessage.responded = true;
            savedMessage.category = parsedGptResponse.inquiryType;
            savedMessage.save();
        }
    } else {
        logger.error("Invalid response from GPT-3");
    }
}
