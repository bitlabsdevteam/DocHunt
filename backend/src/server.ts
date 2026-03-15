import express from "express";
import { chatRouter } from "./routes/chat.js";
import { voiceRouter } from "./routes/voice.js";
import { config } from "./config.js";

const app = express();

app.use(express.json());

app.use("/api", chatRouter);
app.use("/api", voiceRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
});
