// ─── History page ─────────────────────────────────────────────────────────────

import { Navbar }         from "@/components/Navbar";
import { Button }         from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Search, Download, Eye, Loader2 } from "lucide-react";
import { AnalysisResults }     from "@/components/AnalysisResults";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchHistory }        from "@/lib/api";
import type { HistoryEntry }   from "@/lib/api";
import { motion } from "framer-motion";

const levelColors: Record<string, string> = {
  high:     "bg-[#22c55e]/15 text-[#22c55e]",
  medium:   "bg-[#facc15]/15 text-[#facc15]",
  low:      "bg-[#fb923c]/15 text-[#fb923c]",
  critical: "bg-[#ef4444]/15 text-[#ef4444]",
};

const barColors: Record<string, string> = {
  high:     "from-[#22c55e] to-[#4ade80]",
  medium:   "from-[#facc15] to-[#fde047]",
  low:      "from-[#fb923c] to-[#fdba74]",
  critical: "from-[#ef4444] to-[#f87171]",
};

function entryToAnalysis(a: HistoryEntry) {
  const level = (a.level || a.risk_level || "medium") as "high"|"medium"|"low"|"critical";
  const score = a.score ?? a.accuracy_score ?? 0;
  const emojiMap = { high:"✅", medium:"⚠️", low:"🔍", critical:"🚨" };
  return {
    analysis_id:  a.analysis_id || a.id || "",
    timestamp:    a.timestamp   || a.created_at || "",
    text:         a.text        || a.analyzed_text || "",
    user_profile: (a.profile || "student") as "student"|"professor",
    confidence: {
      score:   a.confidence_score ?? score,
      level:   (a.confidence_level || level) as "high"|"medium"|"low"|"critical",
      factors: [],
      flags:   a.confidence_flags || [],
      analysis: { word_count:0, has_citations:false, hallucination_patterns:0, uncertainty_count:0, percentage_count:0 },
    },
    fact_checks: {
      results:           a.fact_check_results || [],
      verified_count:    0,
      total_checks:      (a.fact_check_results || []).length,
      verification_rate: 0,
      has_conflicts:     false,
      conflicts:         [],
    },
    risk: {
      score,
      level,
      color:           level === "high" ? "green" : level === "medium" ? "yellow" : level === "low" ? "orange" : "red",
      emoji:           emojiMap[level] || "⚠️",
      factors:         [],
      recommendations: a.recommendations || [],
      summary:         `${level.charAt(0).toUpperCase() + level.slice(1)} accuracy — score ${score}/100`,
    },
  };
}

export default function History() {
  const [allHistory, setAllHistory] = useState<HistoryEntry[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState<HistoryEntry | null>(null);

  useEffect(() => {
    fetchHistory(100)
      .then(data => { setAllHistory(data.analyses || []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const filtered = allHistory.filter(a => {
    const level = a.level || a.risk_level || "";
    const text  = (a.text || a.analyzed_text || "").toLowerCase();
    if (filter !== "all" && level !== filter) return false;
    if (search && !text.includes(search.toLowerCase()))  return false;
    return true;
  });

  const handleExport = () => {
    const rows = [["Timestamp","Text Preview","Score","Risk Level"]];
    filtered.forEach(a => rows.push([
      new Date(a.timestamp || a.created_at || "").toLocaleString(),
      `"${(a.text || a.analyzed_text || "").slice(0,100).replace(/"/g,"'")}"`,
      String(a.score ?? a.accuracy_score ?? ""),
      a.level || a.risk_level || "",
    ]));
    const csv  = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href     = URL.createObjectURL(blob);
    link.download = "aros-history.csv";
    link.click();
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 30%, #120820 60%, #0f0f12 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[700px] h-[600px] rounded-full bg-[#c47a2a]/15 blur-[180px]" />
        <div className="absolute top-[10%] left-[30%] w-[600px] h-[500px] rounded-full bg-primary/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[#1a0a2e]/80 blur-[100px]" />
      </div>

      <Navbar />
      <div className="container mx-auto pt-28 pb-16 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="font-heading text-4xl font-bold text-white tracking-[-0.02em]">Analysis History</h1>
          <Button className="btn-secondary" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search analyses..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#d63384]/50 focus:border-[#d63384]/30 transition-all"
            />
          </div>
          <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
            {["all","high","medium","low","critical"].map(l => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                className={`px-4 py-2 text-xs font-medium capitalize transition-all duration-200 rounded-[10px] ${
                  filter === l ? "btn-primary text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#ff4da6]" />
            </div>
          )}

          {error && (
            <div className="text-center py-16 text-white/40 text-sm">
              Could not load history — check that{" "}
              <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[#ff4da6] text-xs">VITE_API_URL</code> is set correctly.
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Timestamp","Text Preview","Confidence","Risk","Actions"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-white/30 font-medium text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => {
                    const level = (a.level || a.risk_level || "medium") as keyof typeof levelColors;
                    const score = a.confidence_score ?? a.score ?? a.accuracy_score ?? 0;
                    const text  = a.text || a.analyzed_text || "";
                    const date  = a.timestamp || a.created_at || "";
                    const emoji = { high:"✅", medium:"⚠️", low:"🔍", critical:"🚨" }[level] || "⚠️";
                    const barColor = barColors[level] || barColors.medium;
                    return (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white/30 whitespace-nowrap text-xs">
                          {new Date(date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 max-w-[300px] truncate text-white/70">{text.slice(0,100)}…</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="text-xs text-white font-medium">{score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${levelColors[level] || ""}`}>
                            {emoji} {level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelected(a)}
                            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-white/30 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-white/40 text-sm">
                  {allHistory.length === 0
                    ? <><span>No analyses yet. </span><a href="/demo" className="text-[#ff4da6] hover:underline">Run your first one →</a></>
                    : "No analyses match your filters."
                  }
                </div>
              )}
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-white/30 text-right mt-3">
            Showing {filtered.length} of {allHistory.length} analyses
          </p>
        )}
      </div>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-card !bg-[#0f0f12]/95 backdrop-blur-2xl border-white/[0.1]">
          <DialogHeader>
            <DialogTitle className="font-heading text-white">Analysis Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="glass-card p-4">
                <p className="text-sm text-white/70">{selected.text || selected.analyzed_text}</p>
              </div>
              <AnalysisResults analysis={entryToAnalysis(selected) as any} profile="professor" />
              <p className="text-xs text-white/30">
                Analyzed: {new Date(selected.timestamp || selected.created_at || "").toLocaleString()}
                {(selected.analysis_id || selected.id) && ` • ID: ${selected.analysis_id || selected.id}`}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
