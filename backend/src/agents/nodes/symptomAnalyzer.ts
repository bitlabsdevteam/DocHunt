import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../state.js";
import type { SymptomAnalysis } from "../state.js";
import { config } from "../../config.js";

const SYMPTOM_SYSTEM_PROMPT = `You are a medical symptom analysis assistant for a Japan hospital finder.

Your role:
1. Analyze the patient's described symptoms carefully.
2. Determine the urgency level.
3. Identify what medical specialty or department would be most appropriate.
4. Determine if the patient needs to visit a hospital/clinic.
5. Extract or infer their location if mentioned.

Respond with ONLY a JSON object matching this exact structure:
{
  "symptoms": "concise description of symptoms",
  "location": "location if mentioned, or null",
  "urgency": "low" | "medium" | "high" | "emergency",
  "recommendedSpecialty": "e.g. pediatrics, internal medicine, orthopedics, or null",
  "needsHospitalSearch": true or false,
  "summary": "a brief, caring summary of the assessment for the patient"
}

Guidelines:
- "emergency": life-threatening (chest pain, severe bleeding, loss of consciousness, difficulty breathing)
- "high": needs prompt attention (high fever in children, severe pain, injuries)
- "medium": should see a doctor soon (persistent symptoms, moderate pain)
- "low": can wait or may not need a hospital (mild cold, minor discomfort)

NEVER ask for personal information, payment details, or credit card numbers.`;

export async function symptomAnalyzerNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: config.openaiApiKey,
    temperature: 0.2,
    response_format: { type: "json_object" } as { type: "json_object" },
  });

  const response = await llm.invoke([
    new SystemMessage(SYMPTOM_SYSTEM_PROMPT),
    ...state.messages.slice(-10),
    new HumanMessage(state.userMessage),
  ]);

  const content = typeof response.content === "string" ? response.content : "";

  try {
    const parsed = JSON.parse(content) as SymptomAnalysis;
    return { symptomAnalysis: parsed };
  } catch {
    return {
      symptomAnalysis: {
        symptoms: state.userMessage,
        location: null,
        urgency: "medium",
        recommendedSpecialty: null,
        needsHospitalSearch: true,
        summary: "I understand you are not feeling well. Let me help you find a nearby hospital.",
      },
    };
  }
}
