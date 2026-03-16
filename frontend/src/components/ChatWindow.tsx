import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User } from "lucide-react";
import type { Message, ThinkingStep } from "../types";
import { ResultCard } from "./ResultCard";
import { ThinkingSteps } from "./ThinkingSteps";
import { QuickActions } from "./QuickActions";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  thinkingSteps: ThinkingStep[];
  onQuickAction: (text: string) => void;
}

export function ChatWindow({
  messages,
  isLoading,
  thinkingSteps,
  onQuickAction,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, thinkingSteps]);

  const showWelcome = messages.length === 1 && messages[0].id === "welcome";

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md bg-green-600 text-white"
                    : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {msg.results && msg.results.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.results.map((result, i) => (
                      <ResultCard key={i} result={result} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quick actions after welcome */}
        {showWelcome && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="ml-11"
          >
            <QuickActions onSelect={onQuickAction} />
          </motion.div>
        )}

        {/* Thinking steps during loading */}
        {isLoading && thinkingSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3">
              <ThinkingSteps steps={thinkingSteps} />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </main>
  );
}
