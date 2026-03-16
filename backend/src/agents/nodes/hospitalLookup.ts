import type { AgentState, SearchResult } from "../state.js";
import { config } from "../../config.js";

export async function hospitalLookupNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const analysis = state.symptomAnalysis;

  const queryParts: string[] = [];
  if (analysis?.location) {
    queryParts.push(`near ${analysis.location}`);
  }
  if (analysis?.recommendedSpecialty) {
    queryParts.push(`${analysis.recommendedSpecialty} department`);
  }
  if (analysis?.urgency === "emergency") {
    queryParts.push("emergency room accepting patients now");
  } else {
    queryParts.push("hospital or clinic currently accepting patients");
  }
  if (analysis?.symptoms) {
    queryParts.push(`for patient with: ${analysis.symptoms}`);
  }

  const query = `Available ${queryParts.join(", ")} in Japan`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.perplexityApiKey}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are a hospital search assistant for Japan. The patient urgency level is: ${analysis?.urgency ?? "unknown"}.
Return results as a JSON array of objects with fields: name, address, phone, specialty, availability, distance.
Prioritize hospitals that match the needed specialty and are currently open. Return only valid JSON.`,
          },
          { role: "user", content: query },
        ],
      }),
    });

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "[]";

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const results: SearchResult[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return { searchResults: results };
  } catch (err) {
    console.error("Perplexity search error:", err);
    return { searchResults: [] };
  }
}
