import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-[120px]" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
              <Shield className="h-4 w-4" />
              AI Reliability Overlay System
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
              Catch AI Hallucinations{" "}
              <span className="text-gradient">Before They Catch You</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Real-time fact-checking, confidence scoring, and hallucination detection
              for every AI response. Protect your research, your students, your decisions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/demo">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 h-12 text-base">
                  Try Live Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Built for <span className="text-gradient">Academic Integrity</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors h-full">
                  <div className="gradient-primary rounded-lg p-2.5 w-fit mb-4">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">How AROS Works</h2>
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
                <div className="text-4xl font-heading font-bold text-gradient mb-3">{s.num}</div>
                <h3 className="font-heading font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 text-center gradient-primary border-0">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
              Ready to verify AI reliability?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Try the interactive demo — paste any AI response and see AROS in action.
            </p>
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="px-8 h-12 text-base font-semibold">
                Launch Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-heading font-semibold text-foreground">AROS</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            <Link to="/demo" className="hover:text-foreground transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
