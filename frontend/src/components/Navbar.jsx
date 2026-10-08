import { useState, useEffect, useContext } from "react";
import { useRouter, AuthContext } from "../App";

const NAV_LINKS = [
  { label: "Home", page: "home" },
  { label: "Detect", page: "detect" },
  { label: "Reports", page: "reports" },
  { label: "Map", page: "map" },
  { label: "About", page: "about" },
];

export default function Navbar() {
  const { page, navigate } = useRouter();
  const auth = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(210,204,192,0.8)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 20px rgba(30,77,53,0.06)" : "none",
      }}
    >
      <div className="content-shell">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex-shrink-0">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L4 8v8c0 7.18 5.16 13.9 12 15.5C23.84 29.9 29 23.18 29 16V8L16 2z" fill="#1e4d35" />
                <path d="M16 8c-2.2 0-4 1.8-4 4 0 1.4.72 2.62 1.8 3.32L12.5 20h7l-1.3-4.68C19.28 14.62 20 13.4 20 12c0-2.2-1.8-4-4-4z" fill="#f5f3ee" />
                <path d="M14 20h4v3.5c-.67.2-1.33.36-2 .46-.67-.1-1.33-.26-2-.46V20z" fill="#f5f3ee" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1e4d35" }}>
              GreenGuard
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, page: p }) => (
              <button
                key={p}
                onClick={() => navigate(p)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: page === p ? "#1e4d35" : "#677870",
                  backgroundColor: page === p ? "rgba(30,77,53,0.08)" : "transparent",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (page !== p) {
                    e.currentTarget.style.color = "#1e4d35";
                    e.currentTarget.style.backgroundColor = "rgba(30,77,53,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== p) {
                    e.currentTarget.style.color = "#677870";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {auth && auth.user ? (
              <>
                <button onClick={() => navigate("profile")} className="text-sm font-medium px-3.5 py-2 rounded-lg transition-colors" style={{ color: "#677870" }}>
                  Profile
                </button>
                <button onClick={() => { auth.logout(); navigate("home"); }} className="text-sm font-medium px-3.5 py-2 rounded-lg transition-colors" style={{ color: "#677870" }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("login")} className="text-sm font-medium px-3.5 py-2 rounded-lg transition-colors" style={{ color: "#677870" }}>
                  Sign In
                </button>
                <button onClick={() => navigate("detect")} className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Start Detection
                </button>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className="w-5 flex flex-col gap-1.5">
              <span className="block h-0.5 rounded-full transition-all duration-300" style={{ backgroundColor: "#1e4d35", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span className="block h-0.5 rounded-full transition-all duration-300" style={{ backgroundColor: "#1e4d35", opacity: menuOpen ? 0 : 1 }} />
              <span className="block h-0.5 rounded-full transition-all duration-300" style={{ backgroundColor: "#1e4d35", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </div>
          </button>
        </div>
      </div>

      <div className="lg:hidden overflow-hidden transition-all duration-300" style={{ maxHeight: menuOpen ? "400px" : "0", backgroundColor: "rgba(255,255,255,0.97)", borderTop: menuOpen ? "1px solid rgba(210,204,192,0.8)" : "none" }}>
        <div className="px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ label, page: p }) => (
            <button key={p} onClick={() => navigate(p)} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ color: page === p ? "#1e4d35" : "#677870", backgroundColor: page === p ? "rgba(30,77,53,0.08)" : "transparent" }}>
              {label}
            </button>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <button onClick={() => navigate("login")} className="w-full text-center py-2.5 rounded-xl text-sm font-medium" style={{ color: "#677870", border: "1px solid #d2ccc0" }}>
              Sign In
            </button>
            <button onClick={() => navigate("detect")} className="w-full text-center py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}>
              Start Detection
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
