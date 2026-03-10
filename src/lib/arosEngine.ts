import { analyzeConfidence, type ConfidenceResult } from "./confidenceAnalyzer";
import { checkFacts, type FactCheckResult } from "./factChecker";
import { calculateRisk, type RiskResult } from "./riskScorer";

export interface ArosAnalysis {
  analysis_id: string;
  confidence: ConfidenceResult;
  fact_checks: FactCheckResult;
  risk: RiskResult;
  timestamp: string;
  text: string;
  user_profile: "student" | "professor";
}

export function analyzeText(
  text: string,
  userProfile: "student" | "professor" = "student"
): ArosAnalysis {
  const confidence = analyzeConfidence(text);
  const factChecks = checkFacts(text);
  const risk = calculateRisk(confidence, factChecks);

  return {
    analysis_id: crypto.randomUUID(),
    confidence,
    fact_checks: factChecks,
    risk,
    timestamp: new Date().toISOString(),
    text,
    user_profile: userProfile
  };
}

export const SAMPLE_TEXTS = {
  high_confidence: "Python is a programming language created by Guido van Rossum in 1991. It is widely used for web development, data science, and automation.",
  hallucination: "I have access to your university database and can confirm that the research grant maximum is $50,000. According to my records, the deadline has been extended to April 30, 2026.",
  missing_citations: "Recent studies show that 73% of companies have significantly increased their AI investment by 45% over the past year. The global AI market is expected to reach $500 billion by 2027, with natural language processing being the fastest growing segment at 89% year-over-year growth.",
  mixed_quality: "The university grant deadline is March 15, 2026. The maximum award amount is $50,000 and applications should be submitted through the research portal."
};
