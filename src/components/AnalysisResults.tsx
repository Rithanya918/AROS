import type { ArosAnalysis } from "@/lib/arosEngine";
import { RiskBadge, ConfidenceMeter } from "./RiskBadge";
import { Card } from "@/components/ui/card";
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
      <Card className="p-6 border-border bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3">
              <RiskBadge level={analysis.risk.level} score={analysis.risk.score} emoji={analysis.risk.emoji} />
            </div>
            <p className="text-sm text-muted-foreground">{analysis.risk.summary}</p>
            <ConfidenceMeter score={analysis.confidence.score} level={analysis.confidence.level} />
          </div>
          <div className="text-right space-y-1">
            <div className="text-2xl font-heading font-bold">{analysis.risk.score}</div>
            <div className="text-xs text-muted-foreground">Risk Score</div>
            {analysis.fact_checks.total_checks > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                {analysis.fact_checks.verified_count}/{analysis.fact_checks.total_checks} claims verified
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-primary" />
            Recommendations
          </h4>
          <ul className="space-y-1">
            {analysis.risk.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle detail */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? "Hide details" : "Show full analysis"}
        </button>
      </Card>

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
              <Card className="p-5 border-border bg-card">
                <h4 className="text-sm font-semibold mb-3">Confidence Factors</h4>
                <div className="space-y-2">
                  {analysis.confidence.factors.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-risk-medium shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{f.type.replace(/_/g, " ")}</span>
                        <span className="text-destructive ml-2">({f.impact})</span>
                        <p className="text-muted-foreground text-xs mt-0.5">{f.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Flags */}
            {analysis.confidence.flags.length > 0 && (
              <Card className="p-5 border-destructive/30 bg-destructive/5">
                <h4 className="text-sm font-semibold mb-3 text-destructive">⚠️ Flags</h4>
                <ul className="space-y-1">
                  {analysis.confidence.flags.map((flag, i) => (
                    <li key={i} className="text-sm text-destructive/80">{flag}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Fact Checks */}
            {analysis.fact_checks.results.length > 0 && (
              <Card className="p-5 border-border bg-card">
                <h4 className="text-sm font-semibold mb-3">
                  Fact Check Results ({analysis.fact_checks.verification_rate.toFixed(0)}% verified)
                </h4>
                <div className="space-y-3">
                  {analysis.fact_checks.results.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      {r.verified ? (
                        <CheckCircle className="h-4 w-4 text-risk-high shrink-0 mt-0.5" />
                      ) : r.conflict ? (
                        <XCircle className="h-4 w-4 text-risk-critical shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-risk-medium shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-mono font-medium">{r.claim}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                          r.verified ? "bg-risk-high/15 text-risk-high" :
                          r.conflict ? "bg-risk-critical/15 text-risk-critical" :
                          "bg-risk-medium/15 text-risk-medium"
                        }`}>
                          {r.verified ? "Verified" : r.conflict ? "Conflict" : "Unverified"}
                        </span>
                        <p className="text-muted-foreground text-xs mt-0.5">{r.message}</p>
                        {r.source !== "N/A" && (
                          <p className="text-xs text-primary/70 mt-0.5">Source: {r.source}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Risk Factors */}
            <Card className="p-5 border-border bg-card">
              <h4 className="text-sm font-semibold mb-3">Risk Score Breakdown</h4>
              <div className="space-y-1">
                {analysis.risk.factors.map((f, i) => (
                  <p key={i} className="text-sm text-muted-foreground">• {f}</p>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
