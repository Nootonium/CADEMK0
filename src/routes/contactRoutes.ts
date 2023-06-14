import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Message from "../models/message";

const router = express.Router();

router.post(
    "/contact",
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
        try {
            const newMessage = new Message({
                name,
                email,
                message,
            });
            await newMessage.save();
            res.json({ message: "Message was saved successfully." });
        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
    }
);

export default router;
