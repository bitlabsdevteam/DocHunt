import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import { AuthPage } from "./components/AuthPage";
import { LandingPage } from "./components/LandingPage";
import { ChatHeader } from "./components/ChatHeader";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import type { Message, ThinkingStep } from "./types";

const THINKING_LABELS = [
  "Analyzing symptoms...",
  "Searching nearby clinics...",
  "Checking availability...",
  "Preparing response...",
];

function makeThinkingSteps(): ThinkingStep[] {
  return THINKING_LABELS.map((label, i) => ({
    id: `step-${i}`,
    label,
    status: i === 0 ? "active" : "pending",
  }));
}

export function App() {
  const { session, loading, signOut } = useAuth();
  const [view, setView] = useState<"landing" | "chat">("landing");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I can help you find available hospitals and clinics near you in Japan. Describe your symptoms and location to get started.",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const thinkingTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Advance thinking steps on a timer
  function startThinking() {
    const steps = makeThinkingSteps();
    setThinkingSteps(steps);
    let current = 0;

    thinkingTimer.current = setInterval(() => {
      current++;
      if (current >= THINKING_LABELS.length) {
        clearInterval(thinkingTimer.current);
        return;
      }
      setThinkingSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i < current ? "done" : i === current ? "active" : "pending",
        })),
      );
    }, 1500);
  }

  function stopThinking() {
    clearInterval(thinkingTimer.current);
    setThinkingSteps((prev) => prev.map((s) => ({ ...s, status: "done" })));
    // Clear after a short delay so user sees all checkmarks
    setTimeout(() => setThinkingSteps([]), 400);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(thinkingTimer.current);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      startThinking();

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        const accessToken = session?.access_token;
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({ message: text, history: messages }),
        });
        const data = await res.json();

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          results: data.results ?? undefined,
          timestamp: Date.now(),
        };
        stopThinking();
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        stopThinking();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, session],
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-green-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <AuthPage />;
  }

  // Landing vs Chat view
  return (
    <AnimatePresence mode="wait">
      {view === "landing" ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LandingPage
            onStartChat={() => setView("chat")}
            onSignOut={signOut}
          />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex h-screen flex-col"
        >
          <ChatHeader
            onBack={() => setView("landing")}
            onSignOut={signOut}
          />
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            thinkingSteps={thinkingSteps}
            onQuickAction={handleSend}
          />
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
