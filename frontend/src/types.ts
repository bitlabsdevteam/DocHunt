export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  results?: HospitalResult[];
  timestamp: number;
}

export interface HospitalResult {
  name: string;
  address: string;
  phone?: string;
  specialty?: string;
  availability?: string;
  distance?: string;
}

export interface ThinkingStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
}
