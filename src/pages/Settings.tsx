import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User, Settings2, ShieldCheck, Key } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "extension", label: "Extension", icon: Settings2 },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "api", label: "API Keys", icon: Key },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-8">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 rounded-lg border border-border p-1 bg-card">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium flex-1 justify-center transition-colors ${
                activeTab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <Card className="p-6 bg-card border-border space-y-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Display Name</label>
              <input className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-sm text-foreground" defaultValue="Demo User" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-sm text-foreground" defaultValue="user@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Default Profile</label>
              <select className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-sm text-foreground">
                <option value="student">Student</option>
                <option value="professor">Professor</option>
              </select>
            </div>
            <Button className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
          </Card>
        )}

        {/* Extension */}
        {activeTab === "extension" && (
          <Card className="p-6 bg-card border-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-analyze responses</h3>
                <p className="text-sm text-muted-foreground">Automatically analyze AI responses as they appear</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-primary-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Show badge overlay</h3>
                <p className="text-sm text-muted-foreground">Display confidence badge above AI responses</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-primary-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Desktop notifications</h3>
                <p className="text-sm text-muted-foreground">Get notified when critical risk is detected</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-muted relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-muted-foreground/50" />
              </div>
            </div>
          </Card>
        )}

        {/* Privacy */}
        {activeTab === "privacy" && (
          <Card className="p-6 bg-card border-border space-y-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Data retention</label>
              <select className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-sm text-foreground">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Export All Data</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </Card>
        )}

        {/* API Keys */}
        {activeTab === "api" && (
          <Card className="p-6 bg-card border-border space-y-6">
            <div>
              <h3 className="font-medium mb-2">Your API Keys</h3>
              <p className="text-sm text-muted-foreground mb-4">Use API keys to access AROS programmatically.</p>
              <div className="rounded-lg border border-border p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Default Key</p>
                    <p className="text-xs text-muted-foreground font-mono">aros_sk_...7f3a</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Created Mar 1, 2026</span>
                </div>
              </div>
            </div>
            <Button className="gradient-primary text-primary-foreground border-0">Generate New Key</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
