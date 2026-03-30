import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 30%, #120820 60%, #0f0f12 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[700px] h-[600px] rounded-full bg-[#c47a2a]/15 blur-[180px]" />
        <div className="absolute top-[10%] left-[30%] w-[600px] h-[500px] rounded-full bg-primary/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[#1a0a2e]/80 blur-[100px]" />
      </div>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center relative z-10">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-heading font-bold text-white">404</h1>
          <p className="mb-4 text-xl text-white/50">Oops! Page not found</p>
          <a href="/" className="text-primary hover:text-primary/80 underline transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
