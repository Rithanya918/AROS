import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, Download, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { analyzeText, SAMPLE_TEXTS } from "@/lib/arosEngine";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Generate mock history data
const generateHistory = () => {
  const texts = [
    SAMPLE_TEXTS.high_confidence,
    SAMPLE_TEXTS.hallucination,
    SAMPLE_TEXTS.missing_citations,
    SAMPLE_TEXTS.mixed_quality,
    "The speed of light is approximately 299,792,458 meters per second in a vacuum.",
    "I can see that your account balance is $15,000 and your credit score is 780.",
    "Machine learning algorithms improve through experience without being explicitly programmed.",
  ];
  return texts.map((t, i) => ({
    id: `analysis-${i}`,
    ...analyzeText(t, "student"),
    created_at: new Date(2026, 2, 9 - Math.floor(i / 3), 14 - i, 30).toISOString(),
  }));
};

const allHistory = generateHistory();

const levelColors: Record<string, string> = {
  high: "bg-risk-high/15 text-risk-high",
  medium: "bg-risk-medium/15 text-risk-medium",
  low: "bg-risk-low/15 text-risk-low",
  critical: "bg-risk-critical/15 text-risk-critical",
};

export default function History() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof allHistory[0] | null>(null);

  const filtered = allHistory.filter(a => {
    if (filter !== "all" && a.risk.level !== filter) return false;
    if (search && !a.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold">Analysis History</h1>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
        </div>

        {/* Filters */}
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
            {["all", "high", "medium", "low", "critical"].map(l => (
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

        {/* Table */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Timestamp</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Text Preview</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Confidence</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Risk</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                      {new Date(a.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 max-w-[300px] truncate">{a.text.slice(0, 100)}...</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              a.confidence.level === "high" ? "bg-risk-high" :
                              a.confidence.level === "medium" ? "bg-risk-medium" :
                              a.confidence.level === "low" ? "bg-risk-low" : "bg-risk-critical"
                            }`}
                            style={{ width: `${a.confidence.score}%` }}
                          />
                        </div>
                        <span className="text-xs">{a.confidence.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${levelColors[a.risk.level]}`}>
                        {a.risk.emoji} {a.risk.level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setSelected(a)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No analyses match your filters.</div>
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading">Analysis Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted/30 border-border">
                <p className="text-sm">{selected.text}</p>
              </Card>
              <AnalysisResults analysis={selected} profile="professor" />
              <p className="text-xs text-muted-foreground">
                Analyzed: {new Date(selected.created_at).toLocaleString()} • ID: {selected.analysis_id}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
