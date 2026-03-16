import { ArrowLeft, Bot, LogOut } from "lucide-react";

interface ChatHeaderProps {
  onBack: () => void;
  onSignOut: () => void;
}

export function ChatHeader({ onBack, onSignOut }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <Bot className="h-4 w-4 text-green-700" />
        </div>
        <span className="text-sm font-semibold text-gray-900">DocHunt</span>
      </div>

      <button
        onClick={onSignOut}
        className="text-gray-400 transition-colors hover:text-gray-600"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}
