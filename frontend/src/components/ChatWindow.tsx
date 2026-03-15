import type { Message } from "../types";
import { ResultCard } from "./ResultCard";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <main className="chat-window">
      {messages.map((msg) => (
        <div key={msg.id} className={`chat-bubble chat-bubble--${msg.role}`}>
          <p>{msg.content}</p>
          {msg.results && msg.results.length > 0 && (
            <div className="results-list">
              {msg.results.map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="chat-bubble chat-bubble--assistant">
          <p className="typing-indicator">Searching...</p>
        </div>
      )}
    </main>
  );
}
