import { MapPin, Phone, Stethoscope, Clock, Navigation } from "lucide-react";
import type { HospitalResult } from "../types";

interface ResultCardProps {
  result: HospitalResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="font-semibold text-gray-900">{result.name}</h3>

      <div className="mt-2 space-y-1.5 text-sm text-gray-500">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <span>{result.address}</span>
        </div>

        {result.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{result.phone}</span>
          </div>
        )}

        {result.specialty && (
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{result.specialty}</span>
          </div>
        )}

        {result.availability && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-green-500" />
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              {result.availability}
            </span>
          </div>
        )}

        {result.distance && (
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{result.distance}</span>
          </div>
        )}
      </div>
    </div>
  );
}
