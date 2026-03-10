import type { ConfidenceResult } from "./confidenceAnalyzer";
import type { FactCheckResult } from "./factChecker";

export interface RiskResult {
  score: number;
  level: "high" | "medium" | "low" | "critical";
  color: string;
  emoji: string;
  factors: string[];
  recommendations: string[];
  summary: string;
}

export function calculateRisk(
  confidence: ConfidenceResult,
  factCheck: FactCheckResult
): RiskResult {
  let score = confidence.score;
  const factors: string[] = [];

  // Adjust based on verification rate
  if (factCheck.total_checks > 0) {
    if (factCheck.verification_rate >= 80) {
      score += 15;
      factors.push(`High verification rate (${factCheck.verification_rate.toFixed(0)}%) — +15`);
    } else if (factCheck.verification_rate >= 60) {
      score += 10;
      factors.push(`Moderate verification rate (${factCheck.verification_rate.toFixed(0)}%) — +10`);
    } else {
      factors.push(`Low verification rate (${factCheck.verification_rate.toFixed(0)}%) — no bonus`);
    }
  }

  // Penalize conflicts
  if (factCheck.conflicts.length > 0) {
    const penalty = factCheck.conflicts.length * 15;
    score -= penalty;
    factors.push(`${factCheck.conflicts.length} factual conflict(s) — -${penalty}`);
  }

  // Penalize hallucination patterns
  if (confidence.analysis.hallucination_patterns > 0) {
    factors.push(`${confidence.analysis.hallucination_patterns} hallucination pattern(s) detected`);
  }

  score = Math.max(0, Math.min(100, score));

  const level: RiskResult["level"] =
    score >= 80 ? "high" :
    score >= 60 ? "medium" :
    score >= 40 ? "low" : "critical";

  const colorMap = { high: "green", medium: "yellow", low: "orange", critical: "red" };
  const emojiMap = { high: "✅", medium: "⚠️", low: "🔍", critical: "🚨" };

  const recommendationMap = {
    high: ["Safe to use with normal caution", "Facts verified against known sources"],
    medium: ["Verify key facts before relying on this information", "Cross-reference statistics with original sources"],
    low: ["Independent verification strongly recommended", "Do not cite without checking primary sources", "Multiple unverified claims detected"],
    critical: ["Do NOT use this information without thorough verification", "High probability of hallucination or fabrication", "Consult authoritative sources directly"]
  };

  const summaryMap = {
    high: "High reliability. Information appears accurate and well-supported.",
    medium: "Medium reliability. Some claims need verification.",
    low: "Low reliability. Multiple issues detected — verify independently.",
    critical: "Critical risk. Likely contains hallucinations or false information."
  };

  return {
    score,
    level,
    color: colorMap[level],
    emoji: emojiMap[level],
    factors,
    recommendations: recommendationMap[level],
    summary: summaryMap[level]
  };
}
