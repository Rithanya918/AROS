import type { ArosAnalysis } from "@/lib/arosEngine";
import { RiskBadge, ConfidenceMeter } from "./RiskBadge";
import { CheckCircle, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AnalysisResults({ analysis, profile }: { analysis: ArosAnalysis; profile: "student" | "professor" }) {
  const [expanded, setExpanded] = useState(profile === "professor");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Summary Card */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-4 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3">
              <RiskBadge level={analysis.risk.level} score={analysis.risk.score} emoji={analysis.risk.emoji} />
            </div>
            <p className="text-sm text-white/50">{analysis.risk.summary}</p>
            <ConfidenceMeter score={analysis.confidence.score} level={analysis.confidence.level} />
          </div>
          <div className="text-right space-y-1">
            <div className="text-3xl font-heading font-bold text-white">{analysis.risk.score}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">Risk Score</div>
            {analysis.fact_checks.total_checks > 0 && (
              <div className="text-xs text-white/40 mt-2">
                {analysis.fact_checks.verified_count}/{analysis.fact_checks.total_checks} verified
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-5 pt-5 border-t border-white/[0.08]">
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5 uppercase tracking-wider text-white/60">
            <Info className="h-3.5 w-3.5 text-[#ff4da6]" />
            Recommendations
          </h4>
          <ul className="space-y-1.5">
            {analysis.risk.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-white/50 flex items-start gap-2">
                <span className="text-[#ff4da6] mt-0.5">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle detail */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1 text-sm text-[#ff4da6] hover:text-[#d63384] transition-colors"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? "Hide details" : "Show full analysis"}
        </button>
      </div>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Confidence Factors */}
            {analysis.confidence.factors.length > 0 && (
              <div className="glass-card p-5">
                <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-white/60">Confidence Factors</h4>
                <div className="space-y-2.5">
                  {analysis.confidence.factors.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-[#facc15] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-white">{f.type.replace(/_/g, " ")}</span>
                        <span className="text-[#ef4444] ml-2 text-xs font-mono">({f.impact})</span>
                        <p className="text-white/40 text-xs mt-0.5">{f.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flags */}
            {analysis.confidence.flags.length > 0 && (
              <div className="glass-card p-5 !border-[#ef4444]/20 !bg-[#ef4444]/5">
                <h4 className="text-xs font-semibold mb-3 text-[#ef4444] uppercase tracking-wider">⚠️ Flags</h4>
                <ul className="space-y-1.5">
                  {analysis.confidence.flags.map((flag, i) => (
                    <li key={i} className="text-sm text-[#ef4444]/80">{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fact Checks */}
            {analysis.fact_checks.results.length > 0 && (
              <div className="glass-card p-5">
                <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-white/60">
                  Fact Checks ({analysis.fact_checks.verification_rate.toFixed(0)}% verified)
                </h4>
                <div className="space-y-3">
                  {analysis.fact_checks.results.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      {r.verified ? (
                        <CheckCircle className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      ) : r.conflict ? (
                        <XCircle className="h-4 w-4 text-[#ef4444] shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-[#facc15] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-mono font-medium text-white">{r.claim}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          r.verified ? "bg-[#22c55e]/15 text-[#22c55e]" :
                          r.conflict ? "bg-[#ef4444]/15 text-[#ef4444]" :
                          "bg-[#facc15]/15 text-[#facc15]"
                        }`}>
                          {r.verified ? "Verified" : r.conflict ? "Conflict" : "Unverified"}
                        </span>
                        <p className="text-white/40 text-xs mt-0.5">{r.message}</p>
                        {r.source !== "N/A" && (
                          <p className="text-xs text-[#ff4da6]/70 mt-0.5">Source: {r.source}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Factors */}
            <div className="glass-card p-5">
              <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-white/60">Risk Score Breakdown</h4>
              <div className="space-y-1.5">
                {analysis.risk.factors.map((f, i) => (
                  <p key={i} className="text-sm text-white/50">• {f}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
