import { Shield, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Demo", path: "/demo" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "History", path: "/history" },
  { label: "Docs", path: "/docs" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-white/[0.06]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo — far left */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary rounded-xl p-2 transition-transform group-hover:scale-105">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-white">AROS</span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right — Log In ghost + Join Now pill */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/demo">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-transparent">
              Log In
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="bg-white/[0.08] border border-white/[0.15] text-white hover:bg-white/[0.14] backdrop-blur-sm rounded-full px-5 font-semibold transition-all duration-200">
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/80" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/80 backdrop-blur-2xl px-4 py-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-white/[0.08] text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
