export interface ConfidenceFactor {
  type: string;
  impact: number;
  details: string;
}

export interface ConfidenceResult {
  score: number;
  level: "high" | "medium" | "low" | "critical";
  factors: ConfidenceFactor[];
  flags: string[];
  analysis: {
    word_count: number;
    has_citations: boolean;
    hallucination_patterns: number;
  };
}

const UNCERTAINTY_WORDS = [
  "might", "possibly", "could be", "approximately", "perhaps",
  "maybe", "probably", "likely", "seemingly", "apparently",
  "it seems", "it appears", "arguably", "potentially", "presumably"
];

const HALLUCINATION_PATTERNS = [
  "I have access to",
  "according to my records",
  "in my database",
  "I can see that",
  "looking at your",
  "I can confirm from my",
  "based on my data",
  "from my sources",
  "I have checked",
  "my records show"
];

const CITATION_PATTERNS = [
  "according to", "source:", "[citation", "cited in",
  "referenced in", "as reported by", "published in",
  "(http", "[http", "doi:", "et al."
];

export function analyzeConfidence(text: string): ConfidenceResult {
  let score = 100;
  const factors: ConfidenceFactor[] = [];
  const flags: string[] = [];
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // 1. Uncertainty language
  let uncertaintyCount = 0;
  UNCERTAINTY_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) uncertaintyCount += matches.length;
  });
  if (uncertaintyCount > 0) {
    const impact = Math.min(uncertaintyCount * 5, 25);
    score -= impact;
    factors.push({
      type: "uncertainty_language",
      impact: -impact,
      details: `Found ${uncertaintyCount} uncertainty marker(s)`
    });
  }

  // 2. Hallucination patterns
  let hallucinationCount = 0;
  HALLUCINATION_PATTERNS.forEach(pattern => {
    if (lowerText.includes(pattern.toLowerCase())) {
      hallucinationCount++;
    }
  });
  if (hallucinationCount > 0) {
    const impact = hallucinationCount * 25;
    score -= impact;
    factors.push({
      type: "hallucination_pattern",
      impact: -impact,
      details: `Detected ${hallucinationCount} hallucination pattern(s)`
    });
    flags.push("⚠️ Potential hallucination detected");
  }

  // 3. Suspicious statistics
  const percentageMatches = text.match(/\d+(\.\d+)?%/g) || [];
  if (percentageMatches.length >= 2) {
    const hasCitation = CITATION_PATTERNS.some(p => lowerText.includes(p.toLowerCase()));
    if (!hasCitation) {
      score -= 15;
      factors.push({
        type: "unsourced_statistics",
        impact: -15,
        details: `${percentageMatches.length} percentages without citations: ${percentageMatches.join(", ")}`
      });
      flags.push("Multiple percentages without sources");
    }
  }

  // 4. Missing citations for long text
  const hasCitations = CITATION_PATTERNS.some(p => lowerText.includes(p.toLowerCase()));
  if (wordCount > 200 && !hasCitations) {
    score -= 10;
    factors.push({
      type: "missing_citations",
      impact: -10,
      details: `${wordCount} words with no citations`
    });
  }

  // 5. Overly precise numbers
  const preciseNumbers = text.match(/\$[\d,]+\.\d{2}/g) || [];
  const preciseDates = text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/g) || [];
  if (preciseNumbers.length > 0 && !hasCitations) {
    score -= 10;
    factors.push({
      type: "overly_precise",
      impact: -10,
      details: `Precise financial figures without sources: ${preciseNumbers.join(", ")}`
    });
    flags.push("Suspiciously precise numbers without sources");
  }

  score = Math.max(0, Math.min(100, score));

  const level: ConfidenceResult["level"] =
    score >= 80 ? "high" :
    score >= 60 ? "medium" :
    score >= 40 ? "low" : "critical";

  return {
    score,
    level,
    factors,
    flags,
    analysis: {
      word_count: wordCount,
      has_citations: hasCitations,
      hallucination_patterns: hallucinationCount
    }
  };
}
