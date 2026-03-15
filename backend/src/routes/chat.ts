import { Router } from "express";
import { runAgent } from "../agents/graph.js";

export const chatRouter = Router();

chatRouter.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const result = await runAgent(message, history ?? []);

    res.json(result);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
