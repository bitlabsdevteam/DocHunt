import { motion } from "framer-motion";
import { Search, MapPin, Clock, LogOut } from "lucide-react";

interface LandingPageProps {
  onStartChat: () => void;
  onSignOut: () => void;
}

const features = [
  {
    icon: Search,
    title: "Symptom Analysis",
    description:
      "Describe how you feel and get matched with the right specialty.",
  },
  {
    icon: MapPin,
    title: "Nearby Clinics",
    description:
      "Find hospitals and clinics close to your location in Japan.",
  },
  {
    icon: Clock,
    title: "Real-Time Availability",
    description:
      "Check which facilities are open and accepting patients right now.",
  },
];

export function LandingPage({ onStartChat, onSignOut }: LandingPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 to-teal-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-green-700">DocHunt</span>
        <button
          onClick={onSignOut}
          className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl text-4xl leading-tight font-bold text-gray-900 sm:text-5xl"
        >
          Find the Right Hospital in Japan —{" "}
          <span className="text-green-600">Instantly</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-4 max-w-lg text-lg text-gray-500"
        >
          Describe your symptoms, get matched with nearby clinics, and check
          real-time availability — all through a simple chat.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartChat}
          className="mt-8 cursor-pointer rounded-full bg-green-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700"
        >
          Start Chatting
        </motion.button>

        {/* Features */}
        <div className="mt-20 grid max-w-3xl gap-8 sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
              className="rounded-2xl bg-white/70 p-6 text-left shadow-sm backdrop-blur"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <f.icon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        DocHunt — Built for patients navigating healthcare in Japan
      </footer>
    </div>
  );
}
