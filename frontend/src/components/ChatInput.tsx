import { useState, useRef, useCallback } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, []);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            autoGrow();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Describe your symptoms or ask a question..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-gray-400 focus:border-green-400 focus:bg-white disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizonal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
