import type { AgentState } from "../state.js";

const PII_PATTERNS = [
  /\b\d{3}[-.]?\d{4}[-.]?\d{4}\b/,       // phone numbers
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // credit card
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // email
  /\b\d{3}[-]?\d{4}\b/,                    // Japanese postal code
];

const PII_KEYWORDS = [
  "credit card", "card number", "cvv", "expiry",
  "social security", "my number", "passport",
  "bank account", "routing number",
];

export async function guardrailNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const text = state.userMessage.toLowerCase();

  const hasPiiPattern = PII_PATTERNS.some((p) => p.test(state.userMessage));
  const hasPiiKeyword = PII_KEYWORDS.some((kw) => text.includes(kw));

  if (hasPiiPattern || hasPiiKeyword) {
    return {
      guardrailTriggered: true,
      reply:
        "For your safety, please do not share personal information such as credit card numbers, email addresses, or identification numbers in this chat. I cannot store or process such data. How can I help you find a hospital or clinic instead?",
    };
  }

  return { guardrailTriggered: false };
}
