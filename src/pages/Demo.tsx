// ─── Demo page ────────────────────────────────────────────────────────────────
// CHANGED: now calls the Python backend via analyzeTextWithBackend()
// instead of running analyzeText() locally.
// Everything else — layout, components, styling — is unchanged.

import { Navbar }          from "@/components/Navbar";
import { Button }          from "@/components/ui/button";
import { Card }            from "@/components/ui/card";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useState }        from "react";
import { motion }          from "framer-motion";
import { Loader2, Play, Sparkles, WifiOff } from "lucide-react";
import { analyzeTextWithBackend, toArosAnalysis } from "@/lib/api";
import type { ArosAnalysis } from "@/lib/arosEngine";

// Sample texts (kept local — no API needed to load these)
const SAMPLE_TEXTS = {
  high_confidence:  "Python is a programming language created by Guido van Rossum in 1991. It is widely used for web development, data science, and automation.",
  hallucination:    "I have access to your university database and can confirm that the research grant maximum is $50,000. According to my records, the deadline has been extended to April 30, 2026.",
  missing_citations:"Recent studies show that 73% of companies have significantly increased their AI investment by 45% over the past year. The global AI market is expected to reach $500 billion by 2027.",
  mixed_quality:    "Albert Einstein was born in 1879 in Germany. He won the Nobel Prize in Chemistry in 1921 for his discovery of the law of relativity. He later moved to the United States in 1943.",
};

const samples = [
  { label: "✅ High Confidence",   key: "high_confidence"   as const },
  { label: "🚨 Hallucination",     key: "hallucination"     as const },
  { label: "⚠️ Missing Citations", key: "missing_citations" as const },
  { label: "🔍 Mixed Quality",     key: "mixed_quality"     as const },
];

export default function Demo() {
  const [text,    setText]    = useState("");
  const [profile, setProfile] = useState<"student" | "professor">("student");
  const [result,  setResult]  = useState<ArosAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // ── BACKEND CALL ──────────────────────────────────────────────────────
      // Calls POST /api/analyze on the Python/HF backend.
      // Returns GPT-4o fact-checked results with real accuracy score.
      const response = await analyzeTextWithBackend(text, profile);

      // Convert backend response into the shape AnalysisResults.tsx expects
      const analysis = toArosAnalysis(response) as ArosAnalysis;
      setResult(analysis);
    } catch (err: any) {
      setError(
        err.message?.includes("fetch")
          ? "Cannot reach the AROS backend. Check that VITE_API_URL is set correctly in your .env file."
          : err.message || "Analysis failed — please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (key: keyof typeof SAMPLE_TEXTS) => {
    setText(SAMPLE_TEXTS[key]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">
              <Sparkles className="inline h-7 w-7 text-primary mr-2" />
              Live Analysis Demo
            </h1>
            <p className="text-muted-foreground">
              Paste any AI-generated text. AROS extracts every factual claim, verifies each one with GPT-4o, and returns a real accuracy score.
            </p>
          </motion.div>

          {/* Profile toggle — unchanged */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["student", "professor"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => { setProfile(p); setResult(null); setError(null); }}
                  className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    profile === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Sample chips — unchanged */}
          <div className="flex flex-wrap gap-2 mb-4">
            {samples.map(s => (
              <button
                key={s.key}
                onClick={() => loadSample(s.key)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input card — unchanged */}
          <Card className="p-1 bg-card border-border mb-6">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste AI-generated text here..."
              className="w-full min-h-[160px] bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none"
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-xs text-muted-foreground">
                {text.split(/\s+/).filter(Boolean).length} words
              </span>
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || loading}
                className="gradient-primary text-primary-foreground border-0"
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  : <Play    className="h-4 w-4 mr-2" />
                }
                {loading ? "Checking claims…" : "Analyze"}
              </Button>
            </div>
          </Card>

          {/* Error state — new */}
          {error && (
            <Card className="p-4 border-destructive/30 bg-destructive/5 mb-6">
              <div className="flex items-start gap-3">
                <WifiOff className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">Backend unreachable</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add <code className="bg-muted px-1 rounded">VITE_API_URL=https://your-hf-space.hf.space</code> to your <code className="bg-muted px-1 rounded">.env</code> file.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Loading — unchanged style */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm">Verifying claims with GPT-4o…</span>
              </div>
              <div className="mt-4 h-1 max-w-xs mx-auto rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-primary animate-scan-line w-1/3 rounded-full" />
              </div>
            </div>
          )}

          {/* Results — uses the unchanged AnalysisResults component */}
          {result && !loading && <AnalysisResults analysis={result} profile={profile} />}
        </div>
      </div>
    </div>
  );
}
