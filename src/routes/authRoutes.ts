import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { UserService } from "../services/UserService";

const userService = new UserService({ UserModel });
const router = express.Router();

interface newUserData {
    username: string;
    email: string;
    password: string;
}

// Registration route
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body as newUserData;
    try {
        const userId = await userService.createUser({ username, email, password });
        res.json({ userId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body as { username: string; password: string };
    try {
        const user = await userService.findUserByUsername(username);
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (!user.passwordHash) {
            return res.status(400).json({ error: "Third party login" });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const payload = {
            user: {
                id: user._id,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
