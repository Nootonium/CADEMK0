import Session from "../models/Session";
import { logger } from "../logger";
import { Request, Response } from "express";
import { eventEmitter } from "../events";

export async function trackSessionEvent(req: Request, res: Response) {
    try {
        const { sessionId, eventType, eventData, referralSource, userAgent } = req.body;

        if (!sessionId || !eventType || !eventData) {
            return res
                .status(400)
                .json({ error: "sessionId, eventType, and eventData are required" });
        }
        if (!["section", "click"].includes(eventType)) {
            return res.status(400).json({ error: "Invalid eventType" });
        }

        const event = { eventType, eventData };
        const existingSession = await Session.findOne({ sessionId });

        if (!existingSession) {
            const newSession = new Session({
                sessionId,
                referralSource: referralSource || "direct",
                userAgent,
                events: [event],
            });
            await newSession.save();
            eventEmitter.emit("sessionCreated", {
                sessionId,
                referralSource,
                userAgent,
            });
            logger.info(`New session created: ${sessionId}`);
        } else {
            await Session.updateOne({ sessionId }, { $push: { events: event } });
            logger.info(`Session updated: ${sessionId}, Event: ${eventType}`);
        }

        return res.status(201).json({ message: "Event saved", sessionId });
    } catch (error) {
        logger.error(`Error saving session: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getSessionById(req: Request, res: Response) {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }
        const session = await Session.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        return res.status(200).json(session);
    } catch (error) {
        logger.error(`Error retrieving session: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}
