// ─── Dashboard page ───────────────────────────────────────────────────────────

import { Navbar }      from "@/components/Navbar";
import { Button }      from "@/components/ui/button";
import { BarChart3, Shield, AlertTriangle, Activity, ArrowRight, Loader2, TrendingUp } from "lucide-react";
import { Link }        from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchHistory }        from "@/lib/api";
import type { HistoryEntry }   from "@/lib/api";
import { motion } from "framer-motion";

const levelColors = {
  high:     "bg-[#22c55e]/15 text-[#22c55e]",
  medium:   "bg-[#facc15]/15 text-[#facc15]",
  low:      "bg-[#fb923c]/15 text-[#fb923c]",
  critical: "bg-[#ef4444]/15 text-[#ef4444]",
} as const;

const statIcons = [BarChart3, AlertTriangle, Shield, Activity];
const statAccents = ["#ff4da6", "#ef4444", "#22c55e", "#facc15"];

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

  const total      = history.length;
  const hallucinations = history.filter(h => (h.level || h.risk_level) === "critical").length;
  const avgScore   = total > 0
    ? Math.round(history.reduce((s, h) => s + (h.score ?? h.accuracy_score ?? 0), 0) / total)
    : 0;

  const stats = [
    { label: "Analyses Run",          value: loading ? "…" : String(total),          change: "+12 today" },
    { label: "Hallucinations Caught", value: loading ? "…" : String(hallucinations), change: "critical risk" },
    { label: "Avg Accuracy",          value: loading ? "…" : `${avgScore}%`,         change: "across all runs" },
    { label: "Backend Status",        value: error   ? "Offline" : "Active",         change: "GPT-4o powered" },
  ];

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #e8346c 0%, #f06060 30%, #f5834a 60%, #f9c972 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[700px] h-[600px] rounded-full bg-[#d4276a]/40 blur-[180px]" />
        <div className="absolute top-[10%] left-[30%] w-[600px] h-[500px] rounded-full bg-[#f06080]/30 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[#f9c972]/30 blur-[100px]" />
      </div>

      <Navbar />
      <div className="container mx-auto pt-28 pb-16 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="font-heading text-4xl font-bold text-white tracking-[-0.02em]">Welcome back</h1>
            <p className="text-white/40 mt-1">Your AROS activity overview</p>
          </div>
          <Link to="/demo">
            <Button className="btn-primary border-0 px-6">
              New Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="glass-card p-6 hover:border-white/[0.15] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  {(() => {
                    const Icon = statIcons[i];
                    return <Icon className="h-5 w-5" style={{ color: statAccents[i] }} />;
                  })()}
                  <div className="flex items-center gap-1 text-xs text-white/30">
                    <TrendingUp className="h-3 w-3" />
                    {s.change}
                  </div>
                </div>
                <div className="text-3xl font-heading font-bold text-white mb-1">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" style={{ color: statAccents[i] }} /> : s.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="font-heading font-semibold text-lg text-white">Recent Activity</h2>
            <Link to="/history" className="text-sm text-[#ff4da6] hover:text-[#d63384] transition-colors">View all →</Link>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#ff4da6]" />
            </div>
          )}

          {error && (
            <p className="text-sm text-white/40 text-center py-12 px-6">
              Could not load history — check that <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[#ff4da6] text-xs">VITE_API_URL</code> is set.
            </p>
          )}

          {!loading && !error && history.length === 0 && (
            <p className="text-sm text-white/40 text-center py-12">
              No analyses yet.{" "}
              <Link to="/demo" className="text-[#ff4da6] hover:underline">Run your first one →</Link>
            </p>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-6 pb-3 text-white/30 font-medium text-xs uppercase tracking-wider">Date</th>
                    <th className="px-6 pb-3 text-white/30 font-medium text-xs uppercase tracking-wider">Text Preview</th>
                    <th className="px-6 pb-3 text-white/30 font-medium text-xs uppercase tracking-wider">Score</th>
                    <th className="px-6 pb-3 text-white/30 font-medium text-xs uppercase tracking-wider">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((a, i) => {
                    const level = (a.level || a.risk_level || "medium") as keyof typeof levelColors;
                    const score = a.score ?? a.accuracy_score ?? 0;
                    const text  = a.text || a.analyzed_text || "";
                    const date  = a.timestamp || a.created_at || "";
                    return (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white/30 whitespace-nowrap text-xs">
                          {new Date(date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 max-w-[300px] truncate text-white/70">{text.slice(0, 80)}…</td>
                        <td className="px-6 py-4 font-semibold text-white">{score}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${levelColors[level] || levelColors.medium}`}>
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
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="glass-card p-6 flex items-center justify-between hover:border-white/[0.15] transition-all duration-300">
            <div>
              <h3 className="font-heading font-semibold text-white">Hugging Face Space</h3>
              <p className="text-sm text-white/40 mt-1">Your backend is running on HF Spaces</p>
            </div>
            <Button className="btn-secondary" size="sm" asChild>
              <a href={import.meta.env.VITE_API_URL || "#"} target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </Button>
          </div>
          <div className="glass-card p-6 flex items-center justify-between hover:border-white/[0.15] transition-all duration-300">
            <div>
              <h3 className="font-heading font-semibold text-white">Documentation</h3>
              <p className="text-sm text-white/40 mt-1">Learn how to use AROS effectively</p>
            </div>
            <Link to="/docs"><Button className="btn-secondary" size="sm">View Docs</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
