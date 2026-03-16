export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          status: "active" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          status?: "active" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          status?: "active" | "archived";
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata: MessageMetadata;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata?: MessageMetadata;
          created_at?: string;
        };
        Update: {
          content?: string;
          metadata?: MessageMetadata;
        };
      };
      search_results_cache: {
        Row: {
          id: string;
          query_hash: string;
          query_params: SearchQueryParams;
          results: SearchResultRow[];
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          query_hash: string;
          query_params: SearchQueryParams;
          results: SearchResultRow[];
          expires_at: string;
          created_at?: string;
        };
        Update: {
          results?: SearchResultRow[];
          expires_at?: string;
        };
      };
      embeddings: {
        Row: {
          id: string;
          content: string;
          metadata: EmbeddingMetadata;
          embedding: number[];
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          metadata?: EmbeddingMetadata;
          embedding: number[];
          created_at?: string;
        };
        Update: {
          content?: string;
          metadata?: EmbeddingMetadata;
          embedding?: number[];
        };
      };
      mcp_servers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          transport: "stdio" | "sse" | "streamable-http";
          command: string | null;
          args: string[] | null;
          url: string | null;
          env: Record<string, string>;
          tools: McpTool[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          transport: "stdio" | "sse" | "streamable-http";
          command?: string | null;
          args?: string[] | null;
          url?: string | null;
          env?: Record<string, string>;
          tools?: McpTool[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          transport?: "stdio" | "sse" | "streamable-http";
          command?: string | null;
          args?: string[] | null;
          url?: string | null;
          env?: Record<string, string>;
          tools?: McpTool[];
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
    Functions: {
      match_embeddings: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: string;
          content: string;
          metadata: EmbeddingMetadata;
          similarity: number;
        }[];
      };
    };
  };
}

export interface MessageMetadata {
  symptomAnalysis?: {
    symptoms: string;
    location: string | null;
    urgency: "low" | "medium" | "high" | "emergency";
    recommendedSpecialty: string | null;
    needsHospitalSearch: boolean;
    summary: string;
  };
  searchResults?: SearchResultRow[];
  guardrailTriggered?: boolean;
  agentPath?: string[];
}

export interface SearchQueryParams {
  location: string;
  specialty?: string;
  urgency?: string;
}

export interface SearchResultRow {
  name: string;
  address: string;
  phone?: string;
  specialty?: string;
  availability?: string;
  distance?: string;
}

export interface EmbeddingMetadata {
  source?: string;
  chunk_index?: number;
  document_type?: string;
  language?: string;
}

export interface McpTool {
  name: string;
  description?: string;
  input_schema?: Record<string, unknown>;
}
