import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../state.js";
import { config } from "../../config.js";

const SUPERVISOR_SYSTEM_PROMPT = `You are the supervisor agent for a Japan hospital and clinic finder.

Your role is to analyze the current conversation state and decide which sub-agent should handle the next step.

You have access to these sub-agents:
- "symptom_analyzer": Analyzes the patient's symptoms, determines urgency, and recommends a specialty.
- "hospital_lookup": Searches for nearby available hospitals/clinics based on the symptom analysis.
- "respond": Composes a final helpful response to the user.

Current state:
- symptomAnalysis: {{SYMPTOM_ANALYSIS}}
- searchResults: {{SEARCH_RESULTS}}

Decision rules:
1. If the user's message is a greeting, general question, or does not describe any symptoms → "respond"
2. If the user describes symptoms but no symptom analysis exists yet → "symptom_analyzer"
3. If symptom analysis exists AND needsHospitalSearch is true AND no search results exist → "hospital_lookup"
4. If search results already exist OR symptom analysis says needsHospitalSearch is false → "respond"

NEVER ask for personal information, payment details, or credit card numbers.

Respond with ONLY a JSON object:
{"nextAgent": "symptom_analyzer" | "hospital_lookup" | "respond"}`;

export async function supervisorNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: config.openaiApiKey,
    temperature: 0,
    response_format: { type: "json_object" } as { type: "json_object" },
  });

  const systemPrompt = SUPERVISOR_SYSTEM_PROMPT
    .replace(
      "{{SYMPTOM_ANALYSIS}}",
      state.symptomAnalysis ? JSON.stringify(state.symptomAnalysis) : "none",
    )
    .replace(
      "{{SEARCH_RESULTS}}",
      state.searchResults?.length ? `${state.searchResults.length} results found` : "none",
    );

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    ...state.messages.slice(-10),
    new HumanMessage(state.userMessage),
  ]);

  const content = typeof response.content === "string" ? response.content : "";

  try {
    const parsed = JSON.parse(content);
    const valid = ["symptom_analyzer", "hospital_lookup", "respond", "end"];
    const next = valid.includes(parsed.nextAgent) ? parsed.nextAgent : "respond";
    return { nextAgent: next };
  } catch {
    return { nextAgent: "respond" };
  }
}
