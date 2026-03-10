import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Shield, AlertTriangle, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Analyses", value: "248", icon: BarChart3, change: "+12 today" },
  { label: "Hallucinations Caught", value: "37", icon: AlertTriangle, change: "15% rate" },
  { label: "Avg Accuracy", value: "92%", icon: Shield, change: "+3% this week" },
  { label: "Extension Active", value: "Yes", icon: Activity, change: "v1.0.0" },
];

const recentActivity = [
  { date: "2026-03-09 14:30", text: "Python is a programming language created by Guido van Rossum...", score: 95, level: "high" as const },
  { date: "2026-03-09 13:15", text: "I have access to your university database and can confirm...", score: 15, level: "critical" as const },
  { date: "2026-03-09 11:00", text: "Recent studies show 73% of companies increased AI...", score: 55, level: "low" as const },
  { date: "2026-03-08 16:45", text: "The deadline is March 15, 2026. The maximum award...", score: 65, level: "medium" as const },
  { date: "2026-03-08 10:20", text: "Machine learning models require large datasets for...", score: 88, level: "high" as const },
];

const levelColors = {
  high: "bg-risk-high/15 text-risk-high",
  medium: "bg-risk-medium/15 text-risk-medium",
  low: "bg-risk-low/15 text-risk-low",
  critical: "bg-risk-critical/15 text-risk-critical",
};

export default function Dashboard() {
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <Card key={i} className="p-5 bg-card border-border">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">{s.change}</span>
              </div>
              <div className="text-2xl font-heading font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg">Recent Activity</h2>
            <Link to="/history" className="text-sm text-primary hover:underline">View all</Link>
          </div>
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
                {recentActivity.map((a, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-muted-foreground whitespace-nowrap">{a.date}</td>
                    <td className="py-3 max-w-[300px] truncate">{a.text}</td>
                    <td className="py-3 font-semibold">{a.score}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${levelColors[a.level]}`}>
                        {a.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card className="p-6 bg-card border-border flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold">Browser Extension</h3>
              <p className="text-sm text-muted-foreground">Analyze AI responses automatically</p>
            </div>
            <Button variant="outline" size="sm">Download</Button>
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
