import type { RiskResult } from "@/lib/riskScorer";

const levelStyles = {
  high: "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30",
  medium: "bg-[#facc15]/15 text-[#facc15] border-[#facc15]/30",
  low: "bg-[#fb923c]/15 text-[#fb923c] border-[#fb923c]/30",
  critical: "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30",
};

const barGradients = {
  high: "from-[#22c55e] to-[#4ade80]",
  medium: "from-[#facc15] to-[#fde047]",
  low: "from-[#fb923c] to-[#fdba74]",
  critical: "from-[#ef4444] to-[#f87171]",
};

export function RiskBadge({ level, score, emoji }: Pick<RiskResult, "level" | "score" | "emoji">) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-sm ${levelStyles[level]}`}>
      <span className="text-base">{emoji}</span>
      <span className="capitalize">{level}</span>
      <span className="opacity-60 text-xs">({score})</span>
    </div>
  );
}

export function ConfidenceMeter({ score, level }: { score: number; level: string }) {
  const gradient = barGradients[level as keyof typeof barGradients] || "from-primary to-accent";
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Confidence</span>
        <span className="font-bold text-white">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} animate-meter-fill`}
          style={{ "--meter-width": `${score}%`, width: `${score}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
