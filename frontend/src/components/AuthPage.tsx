import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { Heart } from "lucide-react";

export function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white">
            <Heart className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to DocHunt
          </h1>
          <p className="mt-2 text-gray-500">
            Find the right hospital in Japan — instantly
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#059669",
                    brandAccent: "#047857",
                    inputBorder: "#d1d5db",
                    inputBorderFocus: "#059669",
                    inputBorderHover: "#059669",
                  },
                  borderWidths: { buttonBorderWidth: "0px" },
                  radii: {
                    borderRadiusButton: "0.75rem",
                    inputBorderRadius: "0.75rem",
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
}
