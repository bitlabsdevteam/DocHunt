export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  results?: HospitalResult[];
}

export interface HospitalResult {
  name: string;
  address: string;
  phone?: string;
  specialty?: string;
  availability?: string;
  distance?: string;
}
