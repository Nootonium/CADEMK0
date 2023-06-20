import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { logger } from "../logger";
import { saveNewMessage } from "../services/messageService";
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
        try {
            await saveNewMessage(req.body);
            res.json({ message: "Message was saved successfully." });
        } catch (err) {
            const error = err as Error;
            logger.error(error.message);
            res.status(500).send();
            return;
        }
        // create gpt response
        // send email
        console.log(req.body);
    }
);

export default router;
