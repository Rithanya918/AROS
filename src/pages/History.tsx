// ─── History page ─────────────────────────────────────────────────────────────
// CHANGED: loads real history from backend instead of generating mock data.
// Layout, filters, detail modal — all unchanged.

import { Navbar }         from "@/components/Navbar";
import { Card }           from "@/components/ui/card";
import { Button }         from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Search, Download, Eye, Loader2 } from "lucide-react";
import { AnalysisResults }     from "@/components/AnalysisResults";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchHistory }        from "@/lib/api";
import type { HistoryEntry }   from "@/lib/api";

const levelColors: Record<string, string> = {
  high:     "bg-risk-high/15 text-risk-high",
  medium:   "bg-risk-medium/15 text-risk-medium",
  low:      "bg-risk-low/15 text-risk-low",
  critical: "bg-risk-critical/15 text-risk-critical",
};

// Convert a raw history entry into the shape AnalysisResults.tsx needs
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold">Analysis History</h1>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
        </div>

        {/* Filters — unchanged layout */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search analyses..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {["all","high","medium","low","critical"].map(l => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  filter === l ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Table — unchanged layout */}
        <Card className="bg-card border-border overflow-hidden">
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Could not load history — check that{" "}
              <code className="bg-muted px-1 rounded text-xs">VITE_API_URL</code> is set correctly.
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Timestamp","Text Preview","Confidence","Risk","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-muted-foreground font-medium">{h}</th>
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
                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                          {new Date(date).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 max-w-[300px] truncate">{text.slice(0,100)}…</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  level === "high" ? "bg-risk-high" :
                                  level === "medium" ? "bg-risk-medium" :
                                  level === "low" ? "bg-risk-low" : "bg-risk-critical"
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="text-xs">{score}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${levelColors[level] || ""}`}>
                            {emoji} {level}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelected(a)}
                            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
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
                <div className="text-center py-12 text-muted-foreground text-sm">
                  {allHistory.length === 0
                    ? <><span>No analyses yet. </span><a href="/demo" className="text-primary hover:underline">Run your first one →</a></>
                    : "No analyses match your filters."
                  }
                </div>
              )}
            </div>
          )}
        </Card>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-right mt-2">
            Showing {filtered.length} of {allHistory.length} analyses
          </p>
        )}
      </div>

      {/* Detail modal — unchanged */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading">Analysis Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted/30 border-border">
                <p className="text-sm">{selected.text || selected.analyzed_text}</p>
              </Card>
              <AnalysisResults analysis={entryToAnalysis(selected) as any} profile="professor" />
              <p className="text-xs text-muted-foreground">
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
