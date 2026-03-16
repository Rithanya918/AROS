import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User, Settings2, ShieldCheck, Key } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "extension", label: "Extension", icon: Settings2 },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "api", label: "API Keys", icon: Key },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-[#0f0f12] relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#d63384]/5 blur-[140px] pointer-events-none" />

      <Navbar />
      <div className="container mx-auto pt-28 pb-16 px-4 max-w-3xl relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl font-bold mb-8 text-white tracking-[-0.02em]"
        >
          Settings
        </motion.h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-medium flex-1 justify-center transition-all duration-200 ${
                activeTab === t.id ? "btn-primary text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7 space-y-6">
            <div>
              <label className="text-xs font-medium mb-2 block text-white/50 uppercase tracking-wider">Display Name</label>
              <input className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d63384]/50 transition-all" defaultValue="Demo User" />
            </div>
            <div>
              <label className="text-xs font-medium mb-2 block text-white/50 uppercase tracking-wider">Email</label>
              <input className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d63384]/50 transition-all" defaultValue="user@example.com" />
            </div>
            <div>
              <label className="text-xs font-medium mb-2 block text-white/50 uppercase tracking-wider">Default Profile</label>
              <select className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d63384]/50 transition-all">
                <option value="student">Student</option>
                <option value="professor">Professor</option>
              </select>
            </div>
            <Button className="btn-primary border-0 px-6">Save Changes</Button>
          </motion.div>
        )}

        {/* Extension */}
        {activeTab === "extension" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7 space-y-1">
            {[
              { title: "Auto-analyze responses", desc: "Automatically analyze AI responses as they appear", on: true },
              { title: "Show badge overlay", desc: "Display confidence badge above AI responses", on: true },
              { title: "Desktop notifications", desc: "Get notified when critical risk is detected", on: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-5 border-b border-white/[0.06] last:border-0">
                <div>
                  <h3 className="font-medium text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${item.on ? 'bg-[#d63384]' : 'bg-white/[0.1]'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${item.on ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Privacy */}
        {activeTab === "privacy" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7 space-y-6">
            <div>
              <label className="text-xs font-medium mb-2 block text-white/50 uppercase tracking-wider">Data retention</label>
              <select className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d63384]/50 transition-all">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button className="btn-secondary">Export All Data</Button>
              <Button className="bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/20 hover:bg-[#ef4444]/25 transition-all">Delete Account</Button>
            </div>
          </motion.div>
        )}

        {/* API Keys */}
        {activeTab === "api" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7 space-y-6">
            <div>
              <h3 className="font-medium mb-2 text-white">Your API Keys</h3>
              <p className="text-sm text-white/40 mb-4">Use API keys to access AROS programmatically.</p>
              <div className="rounded-xl border border-white/[0.08] p-5 bg-white/[0.03]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Default Key</p>
                    <p className="text-xs text-white/30 font-mono mt-1">aros_sk_...7f3a</p>
                  </div>
                  <span className="text-xs text-white/30">Created Mar 1, 2026</span>
                </div>
              </div>
            </div>
            <Button className="btn-primary border-0 px-6">Generate New Key</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
