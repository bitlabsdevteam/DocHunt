import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../state.js";
import { config } from "../../config.js";

const RESPOND_SYSTEM_PROMPT = `You are a caring hospital finder assistant for Japan.
Your job is to compose a helpful, reassuring response to the patient.

Guidelines:
- If search results are provided, summarise the options clearly with key details (name, address, specialty, availability).
- If a symptom analysis is provided but no search was needed, give comfort and guidance based on the assessment.
- If no results were found, suggest calling 119 (Japan emergency number) or visiting the nearest hospital.
- For general greetings or questions, respond warmly and explain how you can help.
- NEVER ask for personal information, payment details, or credit card numbers.`;

export async function respondNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: config.openaiApiKey,
    temperature: 0.5,
  });

  const contextParts: string[] = [`User said: "${state.userMessage}"`];

  if (state.symptomAnalysis) {
    contextParts.push(`\nSymptom analysis:\n${JSON.stringify(state.symptomAnalysis, null, 2)}`);
  }

  if (state.searchResults?.length) {
    contextParts.push(`\nHospital search results:\n${JSON.stringify(state.searchResults, null, 2)}`);
  } else if (state.symptomAnalysis?.needsHospitalSearch) {
    contextParts.push("\nNo hospital search results were found.");
  }

  contextParts.push("\nCompose a helpful, caring reply.");

  const response = await llm.invoke([
    new SystemMessage(RESPOND_SYSTEM_PROMPT),
    ...state.messages.slice(-10),
    new HumanMessage(contextParts.join("\n")),
  ]);

  const content = typeof response.content === "string" ? response.content : "";

  return { reply: content };
}
