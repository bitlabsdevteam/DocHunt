import { StateGraph, END } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { AgentState } from "./state.js";
import { guardrailNode } from "./nodes/guardrail.js";
import { supervisorNode } from "./nodes/supervisor.js";
import { symptomAnalyzerNode } from "./nodes/symptomAnalyzer.js";
import { hospitalLookupNode } from "./nodes/hospitalLookup.js";
import { respondNode } from "./nodes/respond.js";
import { ragLookupNode } from "./nodes/ragLookup.js";

function shouldContinueAfterGuardrail(
  state: typeof AgentState.State,
): "blocked" | "continue" {
  return state.guardrailTriggered ? "blocked" : "continue";
}

function routeSupervisor(
  state: typeof AgentState.State,
): "symptom_analyzer" | "hospital_lookup" | "rag_lookup" | "respond" | "end" {
  return state.nextAgent;
}

const workflow = new StateGraph(AgentState)
  .addNode("guardrail", guardrailNode)
  .addNode("supervisor", supervisorNode)
  .addNode("symptom_analyzer", symptomAnalyzerNode)
  .addNode("hospital_lookup", hospitalLookupNode)
  .addNode("rag_lookup", ragLookupNode)
  .addNode("respond", respondNode)
  .addEdge("__start__", "guardrail")
  .addConditionalEdges("guardrail", shouldContinueAfterGuardrail, {
    blocked: END,
    continue: "supervisor",
  })
  .addConditionalEdges("supervisor", routeSupervisor, {
    symptom_analyzer: "symptom_analyzer",
    hospital_lookup: "hospital_lookup",
    rag_lookup: "rag_lookup",
    respond: "respond",
    end: END,
  })
  .addEdge("symptom_analyzer", "supervisor")
  .addEdge("hospital_lookup", "supervisor")
  .addEdge("rag_lookup", "supervisor")
  .addEdge("respond", END);

const app = workflow.compile({ recursionLimit: 10 });

export async function runAgent(
  message: string,
  history: Array<{ role: string; content: string }>,
) {
  const historyMessages = history.map((h) =>
    h.role === "user"
      ? new HumanMessage(h.content)
      : new AIMessage(h.content),
  );

  const result = await app.invoke({
    userMessage: message,
    messages: [...historyMessages, new HumanMessage(message)],
  });

  return {
    reply: result.reply,
    results: result.searchResults ?? [],
  };
}
