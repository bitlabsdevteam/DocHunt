import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { ThinkingStep } from "../types";

interface ThinkingStepsProps {
  steps: ThinkingStep[];
}

export function ThinkingSteps({ steps }: ThinkingStepsProps) {
  return (
    <div className="space-y-2 py-1">
      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 text-sm"
        >
          {step.status === "done" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
          ) : step.status === "active" ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-green-500" />
          ) : (
            <div className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-200" />
          )}
          <span
            className={
              step.status === "done"
                ? "text-gray-500"
                : step.status === "active"
                  ? "font-medium text-gray-800"
                  : "text-gray-400"
            }
          >
            {step.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
