import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { logger } from "../logger";
import Message from "../models/message";
import {
    getGptResponse,
    validateResponse,
    parseGptResponse,
} from "../services/gptService";
import { sendEmail, buildEmailBody } from "../services/emailService";
const router = express.Router();

router.post(
    "/message",
    [
        check("name").notEmpty().withMessage("Name is required"),
        check("email").isEmail().withMessage("Must be a valid email"),
        check("message").notEmpty().withMessage("Message is required"),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const { name, email, message } = req.body;
        const newMessage = new Message({
            name,
            email,
            message,
        });
        try {
            await newMessage.save();
            res.json({ message: "Message was saved successfully." });
        } catch (err) {
            const error = err as Error;
            logger.error(error.message);
            res.status(500).send();
            return;
        }
        
        const gptResponse = await getGptResponse({ name, message });
        if (validateResponse(gptResponse)) {
            const parsedGptResponse = parseGptResponse(gptResponse);
            console.log(parsedGptResponse);

            const emailBody = buildEmailBody({ name, response: parsedGptResponse.response });
            const emailResponse = await sendEmail({ to: email, subject: parsedGptResponse.inquiryType, body: emailBody });
            console.log(emailResponse);
        } else {
            logger.error("Invalid response from GPT-3");
        }

        
    }
);

export default router;
