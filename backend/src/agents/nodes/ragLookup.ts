import { OpenAIEmbeddings } from "@langchain/openai";
import type { AgentState, RagContext } from "../state.js";
import { supabaseAdmin } from "../../db/supabase.js";
import { config } from "../../config.js";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: config.openaiApiKey,
});

export async function ragLookupNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const queryParts: string[] = [state.userMessage];

  if (state.symptomAnalysis) {
    queryParts.push(state.symptomAnalysis.summary);
    if (state.symptomAnalysis.recommendedSpecialty) {
      queryParts.push(state.symptomAnalysis.recommendedSpecialty);
    }
  }

  const query = queryParts.join(" ");

  try {
    const queryEmbedding = await embeddings.embedQuery(query);

    const { data, error } = await supabaseAdmin.rpc("match_embeddings", {
      query_embedding: queryEmbedding,
      match_threshold: 0.75,
      match_count: 5,
    });

    if (error) {
      console.error("RAG lookup error:", error);
      return { ragContext: [] };
    }

    const ragContext: RagContext[] = (data ?? []).map(
      (row: { content: string; metadata: Record<string, unknown>; similarity: number }) => ({
        content: row.content,
        source: (row.metadata?.source as string) ?? null,
        similarity: row.similarity,
      }),
    );

    return { ragContext };
  } catch (err) {
    console.error("RAG lookup error:", err);
    return { ragContext: [] };
  }
}
