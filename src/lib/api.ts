// ─── AROS API Client ──────────────────────────────────────────────────────────
// Single file that connects the Lovable frontend to the Python backend.
// Every page imports from here — change the URL in one place, it updates everywhere.
//
// HOW TO SET THE BACKEND URL:
//   Create a .env file in your project root with:
//   VITE_API_URL=https://your-username-aros-ai-accuracy-checker.hf.space
//   (replace with your actual Hugging Face Space URL)
//
// The HF Space URL format is:
//   https://YOUR_HF_USERNAME-SPACE_NAME.hf.space

const API_BASE = "https://huggingface.co/spaces/Rithanya918/Aros.hf.space";

// ── Types that match what the Python backend returns ──────────────────────────

export interface ClaimResult {
  claim:       string;
  type:        string;
  verdict:     "verified" | "conflict" | "unverified";
  verified:    boolean;
  conflict:    boolean;
  confidence:  number;
  message:     string;
  source_hint: string;
  source:      string;
  severity:    "high" | "medium" | "low";
}

export interface FactCheckResult {
  results:            ClaimResult[];
  verified_count:     number;
  unverified_count:   number;
  conflict_count:     number;
  total_checks:       number;
  verification_rate:  number;
  has_conflicts:      boolean;
  conflicts:          ClaimResult[];
  overall_assessment: string;
  is_fictional:       boolean;
  content_type:       string;
}

export interface ConfidenceFactor {
  type:    string;
  impact:  number;
  details: string;
}

export interface ConfidenceResult {
  score:   number;
  level:   "high" | "medium" | "low" | "critical";
  factors: ConfidenceFactor[];
  flags:   string[];
  analysis: {
    word_count:             number;
    has_citations:          boolean;
    hallucination_patterns: number;
    uncertainty_count:      number;
    percentage_count:       number;
  };
}

export interface AccuracyFactor {
  category: string;
  impact:   number;
  detail:   string;
}

export interface AccuracyResult {
  accuracy_score:  number;
  level:           "high" | "medium" | "low" | "critical";
  label:           string;
  color:           string;
  emoji:           string;
  description:     string;
  recommendations: string[];
  factors:         AccuracyFactor[];
  breakdown: {
    language_score:         number;
    verification_rate:      number;
    verified_claims:        number;
    conflicting_claims:     number;
    unverified_claims:      number;
    total_claims_checked:   number;
    hallucination_patterns: number;
  };
}

// The full response the backend sends back for POST /api/analyze
export interface AnalysisResponse {
  analysis_id:    string;
  timestamp:      string;
  processing_ms:  number;
  source_platform: string;
  user_profile:   string;
  accuracy:       AccuracyResult;
  confidence:     ConfidenceResult;
  fact_checks:    FactCheckResult;
  summary: {
    score:               number;
    label:               string;
    emoji:               string;
    description:         string;
    overall_assessment:  string;
    claims_verified:     number;
    claims_conflicted:   number;
    claims_unverified:   number;
    claims_total:        number;
    recommendations:     string[];
  };
}

// History entry shape
export interface HistoryEntry {
  id:              string;
  analysis_id:     string;
  timestamp:       string;
  created_at:      string;
  text:            string;
  analyzed_text:   string;
  score:           number;
  accuracy_score:  number;
  level:           "high" | "medium" | "low" | "critical";
  risk_level:      string;
  emoji:           string;
  label:           string;
  profile:         string;
  confidence_score: number;
  confidence_level: string;
  confidence_flags: string[];
  fact_check_results: ClaimResult[];
  recommendations: string[];
}

export interface HistoryResponse {
  analyses:           HistoryEntry[];
  total_count:        number;
  hallucination_count: number;
  avg_score:          number | null;
}

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * POST /api/analyze
 * Sends AI text to the backend for full GPT-4o fact-checking.
 * Returns the complete analysis with accuracy score and per-claim verdicts.
 */
export async function analyzeTextWithBackend(
  text:    string,
  profile: "student" | "professor" = "student"
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text:         text.trim(),
      user_profile: profile,
      source_platform: "lovable-frontend",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as any).detail || (err as any).error || `Server error ${response.status}`
    );
  }

  return response.json();
}

/**
 * GET /api/history
 * Fetches the session analysis history from the backend.
 */
export async function fetchHistory(limit = 50): Promise<HistoryResponse> {
  const response = await fetch(`${API_BASE}/api/history?limit=${limit}`);
  if (!response.ok) throw new Error(`Failed to fetch history: ${response.status}`);
  return response.json();
}

/**
 * GET /api/health
 * Checks if the backend is running and fact-checking is enabled.
 */
export async function checkHealth(): Promise<{ status: string; fact_checking: string }> {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) throw new Error("Backend unreachable");
  return response.json();
}

/**
 * Converts the backend AnalysisResponse into the ArosAnalysis shape
 * that the existing AnalysisResults component expects.
 * This lets us keep AnalysisResults.tsx UNCHANGED.
 */
export function toArosAnalysis(r: AnalysisResponse) {
  return {
    analysis_id:  r.analysis_id,
    timestamp:    r.timestamp,
    text:         r.summary?.description || "",
    user_profile: r.user_profile as "student" | "professor",

    confidence: {
      score:   r.confidence.score,
      level:   r.confidence.level,
      factors: r.confidence.factors,
      flags:   r.confidence.flags,
      analysis: r.confidence.analysis,
    },

    fact_checks: {
      results:           r.fact_checks.results.map(c => ({
        ...c,
        source: c.source_hint || c.source || "N/A",
      })),
      verified_count:    r.fact_checks.verified_count,
      total_checks:      r.fact_checks.total_checks,
      verification_rate: r.fact_checks.verification_rate,
      has_conflicts:     r.fact_checks.has_conflicts,
      conflicts:         r.fact_checks.conflicts,
    },

    // Map accuracy result into the "risk" shape AnalysisResults.tsx reads
    risk: {
      score:           r.accuracy.accuracy_score,
      level:           r.accuracy.level,
      color:           r.accuracy.color,
      emoji:           r.accuracy.emoji,
      factors:         r.accuracy.factors.map(f => `${f.category}: ${f.detail} (${f.impact > 0 ? "+" : ""}${f.impact})`),
      recommendations: r.accuracy.recommendations,
      summary:         r.accuracy.description,
    },
  };
}
