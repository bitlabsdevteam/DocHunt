import { Router } from "express";
import { runAgent } from "../agents/graph.js";

export const voiceRouter = Router();

/**
 * Phase 2 stub — ElevenLabs voice agent integration.
 *
 * In production this endpoint will:
 * 1. Receive transcribed speech (text) from ElevenLabs speech-to-text.
 * 2. Run it through the same supervisor agent graph.
 * 3. Return the reply text for ElevenLabs text-to-speech rendering.
 *
 * The agent graph is transport-agnostic — no agent logic changes needed.
 */
voiceRouter.post("/voice", async (req, res) => {
  try {
    const { transcript, history } = req.body;

    if (!transcript || typeof transcript !== "string") {
      res.status(400).json({ error: "transcript is required" });
      return;
    }

    const result = await runAgent(transcript, history ?? []);

    res.json({
      reply: result.reply,
      results: result.results,
    });
  } catch (err) {
    console.error("Voice endpoint error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
