import express from "express";
import { trackSessionEvent, getSessionById } from "../services/trackingService";

const router = express.Router();

router.post("/track", trackSessionEvent);
router.get("/session/:sessionId", getSessionById);

export default router;
