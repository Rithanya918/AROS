import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, BarChart3, Users, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "Real-Time Verification", desc: "Analyze AI responses instantly as they appear" },
  { icon: BarChart3, title: "Confidence Scoring", desc: "0-100 reliability scores with detailed breakdowns" },
  { icon: Users, title: "Dual User Modes", desc: "Tailored views for students and professors" },
  { icon: Shield, title: "Hallucination Detection", desc: "Catch AI fabrications before they cause harm" },
];

const steps = [
  { num: "01", title: "AI Generates Response", desc: "Any AI platform — ChatGPT, Claude, etc." },
  { num: "02", title: "AROS Intercepts", desc: "Our engine analyzes the response in real-time" },
  { num: "03", title: "Verification Engine", desc: "Fact-checking + confidence analysis runs" },
  { num: "04", title: "Risk Score Displayed", desc: "Color-coded badge with actionable insights" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0f0f12] relative overflow-hidden">
      <Navbar />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#d63384]/8 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#ff4da6]/5 blur-[140px]" />
      </div>

      {/* Hero */}
      <section className="pt-36 pb-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d63384]/30 bg-[#d63384]/10 px-5 py-2 text-sm text-[#ff4da6] mb-8 backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              AI Reliability Overlay System
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-[-0.02em] mb-6 max-w-4xl mx-auto leading-[1.1] text-white">
              Catch AI Hallucinations{" "}
              <span className="text-gradient">Before They Catch You</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
              Real-time fact-checking, confidence scoring, and hallucination detection
              for every AI response. Protect your research, your students, your decisions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/demo">
                <Button size="lg" className="btn-primary border-0 px-8 h-13 text-base">
                  Try Live Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" className="btn-secondary h-13 px-8 text-base">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Built for <span className="text-gradient">Academic Integrity</span>
          </h2>
          <p className="text-center text-white/40 mb-14 max-w-lg mx-auto">Everything you need to verify AI-generated content with confidence.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-6 h-full hover:border-[#d63384]/20 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="btn-primary rounded-xl p-2.5 w-fit mb-5 group-hover:shadow-lg group-hover:shadow-[#d63384]/20 transition-shadow">
                    <f.icon className="h-5 w-5 text-white" />
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
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="glass-card p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d63384]/20 to-[#ff4da6]/10 pointer-events-none" />
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
            <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link to="/demo" className="hover:text-white transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
