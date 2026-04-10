import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, BarChart3, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import logoChatgpt from "@/assets/logo-chatgpt.png";
import logoClaude from "@/assets/logo-claude.png";
import logoGemini from "@/assets/logo-gemini.png";
import logoPerplexity from "@/assets/logo-perplexity.png";
import logoCursor from "@/assets/logo-cursor.png";
import logoCopilot from "@/assets/logo-copilot.png";
import logoGrok from "@/assets/logo-grok.png";

const features = [
  { icon: Zap, title: "Real-Time Verification", desc: "Analyze AI responses instantly as they appear" },
  { icon: BarChart3, title: "Confidence Scoring", desc: "0-100 reliability scores with detailed breakdowns" },
  { icon: Users, title: "Works Everywhere", desc: "Tailored for professionals, researchers, and teams" },
  { icon: Shield, title: "Hallucination Detection", desc: "Catch AI fabrications before they cause harm" },
];

const steps = [
  { num: "01", title: "AI Generates Response", desc: "Any AI platform — ChatGPT, Claude, etc." },
  { num: "02", title: "AROS Intercepts", desc: "Our engine analyzes the response in real-time" },
  { num: "03", title: "Verification Engine", desc: "Fact-checking + confidence analysis runs" },
  { num: "04", title: "Risk Score Displayed", desc: "Color-coded badge with actionable insights" },
];

const partnerLogos = [
  "ChatGPT", "Claude", "Gemini", "Perplexity", "Copilot", "Grok", "Cursor",
];

// AI platform logos with brand colors
const aiPlatforms = [
  // Inner ring
  { name: "ChatGPT", color: "#10a37f", logo: logoChatgpt, angle: 0, ring: 1 },
  { name: "Claude", color: "#d4a574", logo: logoClaude, angle: 90, ring: 1 },
  { name: "Gemini", color: "#4285f4", logo: logoGemini, angle: 180, ring: 1 },
  { name: "Perplexity", color: "#20b8cd", logo: logoPerplexity, angle: 270, ring: 1 },
  // Outer ring
  { name: "Cursor", color: "#7c3aed", logo: logoCursor, angle: 0, ring: 2 },
  { name: "Copilot", color: "#0078d4", logo: logoCopilot, angle: 72, ring: 2 },
  { name: "Grok", color: "#ef4444", logo: logoGrok, angle: 144, ring: 2 },
  { name: "ChatGPT", color: "#10a37f", logo: logoChatgpt, angle: 216, ring: 2 },
  { name: "Claude", color: "#d4a574", logo: logoClaude, angle: 288, ring: 2 },
];

function OrbitalGraphic() {
  const ring1Radius = 130; // matches 260px diameter ring
  const ring2Radius = 205; // matches 410px diameter ring
  const ring3Radius = 240; // matches 480px diameter ring

  const ring1Items = aiPlatforms.filter(p => p.ring === 1);
  const ring2Items = aiPlatforms.filter(p => p.ring === 2);

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
      {/* Orbit rings */}
      <div className="absolute w-[260px] h-[260px] rounded-full border border-white/[0.08]" />
      <div className="absolute w-[410px] h-[410px] rounded-full border border-white/[0.06]" />
      <div className="absolute w-[480px] h-[480px] rounded-full border border-white/[0.04]" />

      {/* Center — glowing AROS shield */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="absolute w-20 h-20 rounded-full bg-white/30 blur-[30px]" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-white/60 border border-white/40 flex items-center justify-center shadow-lg shadow-white/20">
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Ring 1 — clockwise */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {ring1Items.map((platform, i) => {
          const rad = (platform.angle * Math.PI) / 180;
          const x = 250 + Math.cos(rad) * ring1Radius;
          const y = 250 + Math.sin(rad) * ring1Radius;
          return (
            <motion.div
              key={`r1-${i}`}
              className="absolute"
              style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="w-11 h-11 rounded-xl backdrop-blur-sm border border-white/[0.15] flex items-center justify-center shadow-lg shadow-black/30 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${platform.color}cc, ${platform.color}66)` }}
              >
                <img src={platform.logo} alt={platform.name} className="w-7 h-7 object-contain" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Ring 2 — counter-clockwise */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        {ring2Items.map((platform, i) => {
          const rad = (platform.angle * Math.PI) / 180;
          const x = 250 + Math.cos(rad) * ring2Radius;
          const y = 250 + Math.sin(rad) * ring2Radius;
          return (
            <motion.div
              key={`r2-${i}`}
              className="absolute"
              style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="w-9 h-9 rounded-full backdrop-blur-sm border border-white/[0.12] flex items-center justify-center shadow-lg shadow-black/20 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${platform.color}aa, ${platform.color}44)` }}
              >
                <img src={platform.logo} alt={platform.name} className="w-6 h-6 object-contain" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Glow effects */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-white/15 blur-[80px]" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-white/5 blur-[100px]" />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #e8346c 0%, #f06060 30%, #f5834a 60%, #f9c972 100%)"
    }}>
      <Navbar />

      {/* Background glows — pink left, orange right */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[700px] h-[600px] rounded-full bg-[#d4276a]/40 blur-[180px]" />
        <div className="absolute top-[10%] left-[30%] w-[600px] h-[500px] rounded-full bg-[#f06080]/30 blur-[160px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#f5a040]/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[#f9c972]/30 blur-[100px]" />
      </div>

      {/* Hero — two-column layout */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-4xl text-primary-foreground/70 mb-8 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                AI Reliability Overlay System
              </div>

              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] mb-6 leading-[1.05] text-white">
                Catch AI Hallucinations{" "}
                <span style={{ color: '#f0c050' }}>Before They Catch You</span>
              </h1>

              <p className="text-lg md:text-xl text-white max-w-xl mb-10 leading-relaxed">
                Real-time fact-checking, confidence scoring, and hallucination detection
                for every AI response. Protect your work, your reputation, your decisions.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/demo">
                  <Button size="lg" className="bg-white/[0.08] border border-white/[0.15] text-white hover:bg-white/[0.12] backdrop-blur-sm rounded-full px-8 h-13 text-base font-semibold transition-all duration-250 hover:-translate-y-0.5">
                    Try Live Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="ghost" className="text-white/60 hover:text-white hover:bg-transparent px-8 h-13 text-base">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right — orbital graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:flex justify-center items-center"
            >
              <OrbitalGraphic />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner logos bar */}
      <section className="relative z-10 border-t border-white/[0.06] py-8 px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partnerLogos.map((name) => (
            <span key={name} className="text-white font-heading font-semibold text-sm tracking-widest uppercase">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Built for <span className="text-gradient">Every Professional</span>
          </h2>
          <p className="text-center text-white/80 mb-14 max-w-lg mx-auto">Everything you need to verify AI-generated content wherever you work.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-6 h-full hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="bg-primary rounded-xl p-2.5 w-fit mb-5 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 text-white">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 border-t border-white/[0.06] relative z-10">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-white">How AROS Works</h2>
          <p className="text-center text-white/40 mb-14 max-w-md mx-auto">Four simple steps to verified AI content.</p>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-heading font-bold text-gradient mb-4">{s.num}</div>
                <h3 className="font-heading font-semibold mb-2 text-white">{s.title}</h3>
                <p className="text-base text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="glass-card p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to verify AI reliability?
              </h2>
              <p className="text-white/50 mb-10 max-w-xl mx-auto text-lg">
                Try the interactive demo — paste any AI response and see AROS in action.
              </p>
              <Link to="/demo">
                <Button size="lg" className="btn-primary px-10 h-13 text-base">
                  Launch Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-4 relative z-10">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-white/40">
          <div className="flex items-center gap-2.5">
            <div className="btn-primary rounded-lg p-1.5">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-heading font-semibold text-white">AROS</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <Link to="/demo" className="hover:text-white transition-colors">Demo</Link>
            <Link to="/demo" className="hover:text-white transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
