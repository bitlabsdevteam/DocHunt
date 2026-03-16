import { motion } from "framer-motion";

interface QuickActionsProps {
  onSelect: (text: string) => void;
}

const suggestions = [
  "I have a fever and headache",
  "Find a clinic near Shibuya",
  "English-speaking dentist in Tokyo",
  "Emergency room near me",
];

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((text, i) => (
        <motion.button
          key={text}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.08 }}
          onClick={() => onSelect(text)}
          className="cursor-pointer rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 transition-colors hover:bg-green-100"
        >
          {text}
        </motion.button>
      ))}
    </div>
  );
}
