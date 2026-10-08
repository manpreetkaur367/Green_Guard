import { useRouter } from "../App";

const PLATFORM_LINKS = [
  { label: "Detection", page: "detect" },
  { label: "Reports", page: "reports" },
  { label: "Incident Map", page: "map" },
  { label: "About", page: "about" },
];

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer style={{ backgroundColor: "#112d1e", color: "#a8c4b0" }}>
      <div className="content-shell py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L4 8v8c0 7.18 5.16 13.9 12 15.5C23.84 29.9 29 23.18 29 16V8L16 2z" fill="#3d7a52" />
                  <path d="M16 8c-2.2 0-4 1.8-4 4 0 1.4.72 2.62 1.8 3.32L12.5 20h7l-1.3-4.68C19.28 14.62 20 13.4 20 12c0-2.2-1.8-4-4-4z" fill="#f5f3ee" />
                  <path d="M14 20h4v3.5c-.67.2-1.33.36-2 .46-.67-.1-1.33-.26-2-.46V20z" fill="#f5f3ee" />
                </svg>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#f5f3ee" }}>
                GreenGuard
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#7aaa8c" }}>
              Detect. Report. Protect.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5a8a6a" }}>
              An intelligent environmental monitoring platform helping communities identify and document suspected tree-cutting activity.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5 uppercase tracking-widest" style={{ color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Platform
            </h4>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map(({ label, page }) => (
                <li key={page}>
                  <button onClick={() => navigate(page)} className="text-sm transition-colors hover:text-green-300" style={{ color: "#7aaa8c" }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5 uppercase tracking-widest" style={{ color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Resources
            </h4>
            <ul className="space-y-3">
              {['Documentation', 'Privacy Policy', 'Terms of Use', 'Support'].map((item) => (
                <li key={item}>
                  <span className="text-sm cursor-pointer transition-colors" style={{ color: "#7aaa8c" }}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(61,122,82,0.25)", color: "#87c49e" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" style={{ backgroundColor: "#87c49e" }} />
                Demo Mode Active
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ borderTop: "1px solid rgba(61,122,82,0.3)", color: "#4a7a5a" }}>
          <p>&copy; 2026 GreenGuard. Environmental monitoring platform. All rights reserved.</p>
          <p className="text-center">AI results require human verification before any enforcement action.</p>
        </div>
      </div>
    </footer>
  );
}
