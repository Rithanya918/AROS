import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalysisResults } from "@/components/AnalysisResults";
import { analyzeText, SAMPLE_TEXTS, type ArosAnalysis } from "@/lib/arosEngine";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Play, Sparkles } from "lucide-react";

const samples = [
  { label: "✅ High Confidence", key: "high_confidence" as const },
  { label: "🚨 Hallucination", key: "hallucination" as const },
  { label: "⚠️ Missing Citations", key: "missing_citations" as const },
  { label: "🔍 Mixed Quality", key: "mixed_quality" as const },
];

export default function Demo() {
  const [text, setText] = useState("");
  const [profile, setProfile] = useState<"student" | "professor">("student");
  const [result, setResult] = useState<ArosAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const analysis = analyzeText(text, profile);
    setResult(analysis);
    setLoading(false);
  };

  const loadSample = (key: keyof typeof SAMPLE_TEXTS) => {
    setText(SAMPLE_TEXTS[key]);
    setResult(null);
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
              Paste any AI-generated text to see AROS analyze its reliability in real-time.
            </p>
          </motion.div>

          {/* Profile Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["student", "professor"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => { setProfile(p); setResult(null); }}
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

          {/* Sample Texts */}
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

          {/* Input */}
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
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Analyze
              </Button>
            </div>
          </Card>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm">Running AROS pipeline...</span>
              </div>
              <div className="mt-4 h-1 max-w-xs mx-auto rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-primary animate-scan-line w-1/3 rounded-full" />
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && <AnalysisResults analysis={result} profile={profile} />}
        </div>
      </div>
    </div>
  );
}
