import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Book, Code, HelpCircle, Layers, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "getting-started",
    icon: Zap,
    title: "Getting Started",
    subsections: [
      {
        title: "Installation",
        content: `## Installing AROS

### Browser Extension
1. Download the AROS extension from the Chrome Web Store
2. Click "Add to Chrome" and confirm
3. The AROS shield icon will appear in your toolbar

### Web Dashboard
Visit the AROS dashboard at your deployed URL and create an account to track your analysis history.`
      },
      {
        title: "Quick Start",
        content: `## Quick Start Guide

1. **Install the extension** — click the shield icon to confirm it's active
2. **Visit any AI platform** — ChatGPT, Claude, etc.
3. **Generate a response** — AROS automatically analyzes it
4. **Check the badge** — color-coded reliability score appears above the response
5. **Click for details** — expand to see full analysis breakdown`
      },
    ]
  },
  {
    id: "using-aros",
    icon: Shield,
    title: "Using AROS",
    subsections: [
      {
        title: "How It Works",
        content: `## How AROS Works

AROS runs a three-stage pipeline on every AI response:

### 1. Confidence Analysis
Scans for uncertainty language, hallucination patterns, missing citations, and suspicious statistics.

### 2. Fact Checking
Extracts verifiable claims (dates, amounts, percentages) and cross-references them against known databases.

### 3. Risk Scoring
Combines confidence and fact-check results into a single 0-100 reliability score with actionable recommendations.`
      },
      {
        title: "Reading Results",
        content: `## Understanding AROS Results

### Risk Levels
- ✅ **High (80-100)**: Safe to use — facts verified
- ⚠️ **Medium (60-79)**: Verify key facts before relying
- 🔍 **Low (40-59)**: Independent verification required
- 🚨 **Critical (0-39)**: Do NOT use without thorough verification

### Confidence Factors
Each factor shows what reduced confidence and by how much. Common factors:
- Uncertainty language (-5 to -25)
- Hallucination patterns (-25 per pattern)
- Unsourced statistics (-15)
- Missing citations (-10)`
      },
      {
        title: "Student vs Professor Mode",
        content: `## User Profiles

### Student Mode
- Simplified summary view
- Key recommendations highlighted
- Risk badge always visible
- Details collapsed by default

### Professor Mode
- Full analysis expanded by default
- All confidence factors visible
- Fact-check details shown
- Risk scoring breakdown included`
      }
    ]
  },
  {
    id: "api",
    icon: Code,
    title: "API Reference",
    subsections: [
      {
        title: "POST /api/analyze",
        content: `## Analyze Endpoint

\`\`\`
POST /api/analyze
Content-Type: application/json
\`\`\`

### Request Body
\`\`\`json
{
  "text": "AI generated response here",
  "user_id": "user123",
  "user_profile": "student",
  "source_platform": "claude.ai"
}
\`\`\`

### Response
\`\`\`json
{
  "analysis_id": "uuid",
  "confidence": {
    "score": 75,
    "level": "medium",
    "factors": [...],
    "flags": [...]
  },
  "fact_checks": {
    "results": [...],
    "verification_rate": 60
  },
  "risk": {
    "score": 70,
    "level": "medium",
    "emoji": "⚠️",
    "recommendations": [...]
  }
}
\`\`\``
      }
    ]
  },
  {
    id: "faq",
    icon: HelpCircle,
    title: "FAQ",
    subsections: [
      {
        title: "Common Questions",
        content: `## Frequently Asked Questions

**Q: Does AROS read my personal data?**
A: No. AROS only analyzes the AI-generated response text. It does not access your personal data, files, or browser history.

**Q: Which AI platforms are supported?**
A: Currently ChatGPT (chat.openai.com) and Claude (claude.ai). More platforms coming soon.

**Q: How accurate is the fact checking?**
A: AROS checks against a reference database of verified facts. It can catch known inaccuracies but may not verify all claims. Always use critical thinking alongside AROS scores.

**Q: Can I use AROS offline?**
A: The core confidence analysis runs locally. Fact-checking requires an internet connection to query reference databases.

**Q: Is there an API I can use programmatically?**
A: Yes! See the API Reference section for details on the /api/analyze endpoint.`
      }
    ]
  }
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeSubIndex, setActiveSubIndex] = useState(0);

  const currentSection = sections.find(s => s.id === activeSection)!;
  const currentSub = currentSection.subsections[activeSubIndex];

  return (
    <div className="min-h-screen bg-[#0f0f12] relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#d63384]/5 blur-[140px] pointer-events-none" />

      <Navbar />
      <div className="container mx-auto pt-28 pb-16 px-4 relative z-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              {sections.map(s => (
                <div key={s.id}>
                  <button
                    onClick={() => { setActiveSection(s.id); setActiveSubIndex(0); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                      activeSection === s.id ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                    }`}
                  >
                    <s.icon className="h-4 w-4" style={{ color: activeSection === s.id ? '#ff4da6' : undefined }} />
                    {s.title}
                  </button>
                  {activeSection === s.id && (
                    <div className="ml-7 mt-1 space-y-0.5 border-l border-white/[0.08] pl-3">
                      {s.subsections.map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSubIndex(i)}
                          className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
                            activeSubIndex === i ? "text-[#ff4da6]" : "text-white/30 hover:text-white/60"
                          }`}
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile section select */}
            <div className="md:hidden mb-6">
              <select
                value={activeSection}
                onChange={e => { setActiveSection(e.target.value); setActiveSubIndex(0); }}
                className="w-full p-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white"
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <motion.div
              key={`${activeSection}-${activeSubIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card p-8">
                <div className="prose prose-invert prose-sm max-w-none">
                  {currentSub.content.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) return <h2 key={i} className="font-heading text-2xl font-bold mb-4 mt-0 text-white tracking-[-0.02em]">{line.replace("## ", "")}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="font-heading text-lg font-semibold mb-2 mt-6 text-white">{line.replace("### ", "")}</h3>;
                    if (line.startsWith("```")) return <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-5 py-3 font-mono text-xs my-3 text-[#ff4da6]/80 overflow-x-auto">{line.replace(/```\w*/, "")}</div>;
                    if (line.startsWith("- ")) return <li key={i} className="text-white/50 ml-4 mb-1.5">{line.replace("- ", "")}</li>;
                    if (line.startsWith("**Q:")) return <p key={i} className="font-semibold mt-5 text-white">{line.replace(/\*\*/g, "")}</p>;
                    if (line.startsWith("A:")) return <p key={i} className="text-white/50 mb-4">{line}</p>;
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="text-white/50 mb-2 leading-relaxed">{line}</p>;
                  })}
                </div>
              </div>
            </motion.div>

            {/* Nav buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  if (activeSubIndex > 0) setActiveSubIndex(activeSubIndex - 1);
                  else {
                    const idx = sections.findIndex(s => s.id === activeSection);
                    if (idx > 0) {
                      setActiveSection(sections[idx - 1].id);
                      setActiveSubIndex(sections[idx - 1].subsections.length - 1);
                    }
                  }
                }}
                className="text-sm text-white/30 hover:text-[#ff4da6] transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  if (activeSubIndex < currentSection.subsections.length - 1) setActiveSubIndex(activeSubIndex + 1);
                  else {
                    const idx = sections.findIndex(s => s.id === activeSection);
                    if (idx < sections.length - 1) {
                      setActiveSection(sections[idx + 1].id);
                      setActiveSubIndex(0);
                    }
                  }
                }}
                className="text-sm text-white/30 hover:text-[#ff4da6] transition-colors"
              >
                Next →
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
