import { OpenAIEmbeddings } from "@langchain/openai";
import type { AgentState, RagContext } from "../state.js";
import { supabaseAdmin } from "../../db/supabase.js";
import type { Database } from "../../db/types.js";
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

    type MatchArgs = Database["public"]["Functions"]["match_embeddings"]["Args"];
    type MatchReturn = Database["public"]["Functions"]["match_embeddings"]["Returns"];
    const args: MatchArgs = {
      query_embedding: queryEmbedding,
      match_threshold: 0.75,
      match_count: 5,
    };
    const { data, error } = (await supabaseAdmin.rpc(
      "match_embeddings",
      args as unknown as undefined,
    )) as unknown as { data: MatchReturn | null; error: { message: string } | null };

    if (error) {
      console.error("RAG lookup error:", error);
      return { ragContext: [] };
    }

    const rows = (data ?? []) as unknown as {
      content: string;
      metadata: Record<string, unknown>;
      similarity: number;
    }[];
    const ragContext: RagContext[] = rows.map((row) => ({
      content: row.content,
      source: (row.metadata?.source as string) ?? null,
      similarity: row.similarity,
    }));

    return { ragContext };
  } catch (err) {
    console.error("RAG lookup error:", err);
    return { ragContext: [] };
  }
}
