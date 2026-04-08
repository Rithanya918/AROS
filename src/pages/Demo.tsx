import { Navbar }          from "@/components/Navbar";
import { Button }          from "@/components/ui/button";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useState }        from "react";
import { motion }          from "framer-motion";
import { Loader2, Play, Sparkles, WifiOff } from "lucide-react";
import { analyzeTextWithBackend, toArosAnalysis } from "@/lib/api";
import type { ArosAnalysis } from "@/lib/arosEngine";

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
  const [result,  setResult]  = useState<ArosAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await analyzeTextWithBackend(text);
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
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #e8346c 0%, #f06060 30%, #f5834a 60%, #f9c972 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[700px] h-[600px] rounded-full bg-[#d4276a]/40 blur-[180px]" />
        <div className="absolute top-[10%] left-[30%] w-[600px] h-[500px] rounded-full bg-[#f06080]/30 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[#f9c972]/30 blur-[100px]" />
      </div>
      <Navbar />
      <div className="container mx-auto pt-28 pb-16 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-heading text-4xl font-bold mb-3 text-white tracking-[-0.02em]">
              <Sparkles className="inline h-8 w-8 text-[#ff4da6] mr-2" />
              Live Analysis Demo
            </h1>
            <p className="text-white/40 text-lg">
              Paste any AI-generated text. AROS extracts every factual claim, verifies each one with GPT-4o, and returns a real accuracy score.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-5">
            {samples.map(s => (
              <button
                key={s.key}
                onClick={() => loadSample(s.key)}
                className="text-xs px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/80 hover:border-[#d63384]/30 hover:bg-[#d63384]/5 transition-all duration-200"
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="glass-card p-1 mb-6">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste AI-generated text here..."
              className="w-full min-h-[180px] bg-transparent p-5 text-sm text-white placeholder:text-white/20 resize-y focus:outline-none"
            />
            <div className="flex items-center justify-between px-5 pb-4">
              <span className="text-xs text-white/30">
                {text.split(/\s+/).filter(Boolean).length} words
              </span>
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || loading}
                className="btn-primary border-0 px-6 h-10"
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  : <Play    className="h-4 w-4 mr-2" />
                }
                {loading ? "Checking claims…" : "Analyze"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="glass-card p-5 !border-[#ef4444]/20 !bg-[#ef4444]/5 mb-6">
              <div className="flex items-start gap-3">
                <WifiOff className="h-5 w-5 text-[#ef4444] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#ef4444] mb-1">Backend unreachable</p>
                  <p className="text-xs text-white/40">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 text-white/50">
                <Loader2 className="h-5 w-5 animate-spin text-[#ff4da6]" />
                <span className="text-sm">Verifying claims with GPT-4o…</span>
              </div>
              <div className="mt-6 h-1 max-w-xs mx-auto rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#d63384] to-[#ff4da6] animate-scan-line w-1/3 rounded-full" />
              </div>
            </div>
          )}

          {result && !loading && <AnalysisResults analysis={result} profile="student" />}
        </div>
      </div>
    </div>
  );
}
