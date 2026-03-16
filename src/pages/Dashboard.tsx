// ─── Dashboard page ───────────────────────────────────────────────────────────
// CHANGED: stats and recent activity now come from the backend API.
// Layout, styling, and all components are unchanged.

import { Navbar }      from "@/components/Navbar";
import { Card }        from "@/components/ui/card";
import { Button }      from "@/components/ui/button";
import { BarChart3, Shield, AlertTriangle, Activity, ArrowRight, Loader2 } from "lucide-react";
import { Link }        from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchHistory }        from "@/lib/api";
import type { HistoryEntry }   from "@/lib/api";

const levelColors = {
  high:     "bg-risk-high/15 text-risk-high",
  medium:   "bg-risk-medium/15 text-risk-medium",
  low:      "bg-risk-low/15 text-risk-low",
  critical: "bg-risk-critical/15 text-risk-critical",
} as const;

export default function Dashboard() {
  const [history,  setHistory]  = useState<HistoryEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    fetchHistory(10)
      .then(data => {
        setHistory(data.analyses || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Derive stats from real history
  const total      = history.length;
  const hallucinations = history.filter(h => (h.level || h.risk_level) === "critical").length;
  const avgScore   = total > 0
    ? Math.round(history.reduce((s, h) => s + (h.score ?? h.accuracy_score ?? 0), 0) / total)
    : 0;

  const stats = [
    { label: "Analyses",             value: loading ? "…" : String(total),          icon: BarChart3,    change: "this session" },
    { label: "Hallucinations Caught", value: loading ? "…" : String(hallucinations), icon: AlertTriangle, change: "critical risk" },
    { label: "Avg Accuracy",          value: loading ? "…" : `${avgScore}%`,         icon: Shield,        change: "across all runs" },
    { label: "Backend Status",        value: error   ? "Offline" : "Active",         icon: Activity,      change: "GPT-4o powered" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Your AROS activity overview</p>
          </div>
          <Link to="/demo">
            <Button className="gradient-primary text-primary-foreground border-0">
              New Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats grid — same layout, live data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <Card key={i} className="p-5 bg-card border-border">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">{s.change}</span>
              </div>
              <div className="text-2xl font-heading font-bold">
                {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : s.value}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Recent Activity — same layout, live data */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg">Recent Activity</h2>
            <Link to="/history" className="text-sm text-primary hover:underline">View all</Link>
          </div>

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Could not load history — check that <code className="bg-muted px-1 rounded text-xs">VITE_API_URL</code> is set.
            </p>
          )}

          {!loading && !error && history.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No analyses yet.{" "}
              <Link to="/demo" className="text-primary hover:underline">Run your first one →</Link>
            </p>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-muted-foreground font-medium">Date</th>
                    <th className="pb-3 text-muted-foreground font-medium">Text Preview</th>
                    <th className="pb-3 text-muted-foreground font-medium">Score</th>
                    <th className="pb-3 text-muted-foreground font-medium">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((a, i) => {
                    const level = (a.level || a.risk_level || "medium") as keyof typeof levelColors;
                    const score = a.score ?? a.accuracy_score ?? 0;
                    const text  = a.text || a.analyzed_text || "";
                    const date  = a.timestamp || a.created_at || "";
                    return (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-3 text-muted-foreground whitespace-nowrap text-xs">
                          {new Date(date).toLocaleString()}
                        </td>
                        <td className="py-3 max-w-[300px] truncate">{text.slice(0, 80)}…</td>
                        <td className="py-3 font-semibold">{score}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${levelColors[level] || levelColors.medium}`}>
                            {level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick Actions — unchanged */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card className="p-6 bg-card border-border flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold">Hugging Face Space</h3>
              <p className="text-sm text-muted-foreground">Your backend is running on HF Spaces</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={import.meta.env.VITE_API_URL || "#"} target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </Button>
          </Card>
          <Card className="p-6 bg-card border-border flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold">Documentation</h3>
              <p className="text-sm text-muted-foreground">Learn how to use AROS effectively</p>
            </div>
            <Link to="/docs"><Button variant="outline" size="sm">View Docs</Button></Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
