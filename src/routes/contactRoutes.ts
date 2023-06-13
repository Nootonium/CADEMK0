import express from "express";
import Message from "../models/message";

const router = express.Router();

router.post("/contact", async (req, res) => {
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
});

export default router;
