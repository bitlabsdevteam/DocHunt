import type { HospitalResult } from "../types";

interface ResultCardProps {
  result: HospitalResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="result-card">
      <h3>{result.name}</h3>
      <p className="result-address">{result.address}</p>
      {result.specialty && <p className="result-specialty">{result.specialty}</p>}
      {result.availability && (
        <p className="result-availability">{result.availability}</p>
      )}
      {result.distance && <p className="result-distance">{result.distance}</p>}
      {result.phone && <p className="result-phone">{result.phone}</p>}
    </div>
  );
}
