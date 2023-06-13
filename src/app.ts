import express from "express";
import cors from "cors";
import connectDB from "./database/connectDB";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes";
import rateLimit from "express-rate-limit";

dotenv.config();

connectDB();

const app = express();
const port = 3000;

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
});

app.use(limiter);
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN,
    })
);

app.use(express.json());
app.use(contactRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
