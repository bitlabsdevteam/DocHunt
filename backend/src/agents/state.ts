import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
  userMessage: Annotation<string>(),
  guardrailTriggered: Annotation<boolean>({
    reducer: (_prev, next) => next,
    default: () => false,
  }),
  nextAgent: Annotation<
    "symptom_analyzer" | "hospital_lookup" | "respond" | "end"
  >({
    reducer: (_prev, next) => next,
    default: () => "end" as const,
  }),
  symptomAnalysis: Annotation<SymptomAnalysis | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  searchResults: Annotation<SearchResult[] | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  reply: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => "",
  }),
});

export interface SymptomAnalysis {
  symptoms: string;
  location: string | null;
  urgency: "low" | "medium" | "high" | "emergency";
  recommendedSpecialty: string | null;
  needsHospitalSearch: boolean;
  summary: string;
}

export interface SearchResult {
  name: string;
  address: string;
  phone?: string;
  specialty?: string;
  availability?: string;
  distance?: string;
}
