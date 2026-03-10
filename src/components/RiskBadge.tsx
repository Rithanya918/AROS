import type { RiskResult } from "@/lib/riskScorer";

const levelStyles = {
  high: "bg-risk-high/15 text-risk-high border-risk-high/30",
  medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
};

const barStyles = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
  critical: "bg-risk-critical",
};

export function RiskBadge({ level, score, emoji }: Pick<RiskResult, "level" | "score" | "emoji">) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${levelStyles[level]}`}>
      <span>{emoji}</span>
      <span className="capitalize">{level}</span>
      <span className="opacity-70">({score})</span>
    </div>
  );
}

export function ConfidenceMeter({ score, level }: { score: number; level: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Confidence</span>
        <span className="font-semibold">{score}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barStyles[level as keyof typeof barStyles] || "bg-primary"}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
