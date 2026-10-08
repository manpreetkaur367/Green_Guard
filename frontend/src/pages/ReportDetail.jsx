import { useRouter } from "../App";
import { SAMPLE_INCIDENTS } from "../data/sample";

function RiskBadge({ level }) {
  const map = {
    High: { bg: "#fef2f2", text: "#dc2626" },
    Medium: { bg: "#fffbeb", text: "#d97706" },
    Low: { bg: "#f0fdf4", text: "#16a34a" },
  };
  const current = map[level] || map.Medium;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: current.bg, color: current.text }}>{level} Risk</span>;
}

export default function ReportDetail() {
  const { navigate, params } = useRouter();
  const incidentId = params.id || "GG-2026-00421";
  const incident = SAMPLE_INCIDENTS.find((item) => item.id === incidentId) || SAMPLE_INCIDENTS[0];

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="content-shell max-w-[1400px]">
        <button onClick={() => navigate("reports")} className="inline-flex items-center gap-2 text-sm font-medium mb-6" style={{ color: "#1e4d35" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Reports
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
            <div className="p-5 border-b" style={{ borderColor: "#e8e3da", backgroundColor: "#fafaf8" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "#677870" }}>Incident Record</p>
                  <h1 className="text-3xl font-bold mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>{incident.id}</h1>
                </div>
                <RiskBadge level={incident.riskLevel} />
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Detection", incident.detection],
                  ["Status", incident.status],
                  ["Date", incident.date],
                  ["Time", incident.time],
                  ["Location", incident.location],
                  ["City", incident.city],
                  ["State", incident.state],
                  ["Country", incident.country],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl p-4" style={{ backgroundColor: "#f5f3ee" }}>
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#677870" }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: "#1a2820" }}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: "#f5f3ee" }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#677870" }}>Description</p>
                <p className="text-sm leading-7" style={{ color: "#1a2820" }}>{incident.description}</p>
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: "#f5f3ee" }}>
                <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "#677870" }}>Detected Objects</p>
                <div className="flex flex-wrap gap-2">
                  {incident.detectedObjects.map((obj) => (
                    <span key={obj} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>{obj}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Summary</h2>
              <div className="space-y-3 text-sm" style={{ color: "#677870" }}>
                <div className="flex items-center justify-between"><span>Risk score</span><span className="font-semibold" style={{ color: "#1a2820" }}>{incident.riskScore}</span></div>
                <div className="flex items-center justify-between"><span>Confidence</span><span className="font-semibold" style={{ color: "#1a2820" }}>{incident.confidence}%</span></div>
                <div className="flex items-center justify-between"><span>Reporter</span><span className="font-semibold" style={{ color: "#1a2820" }}>{incident.reporter}</span></div>
                <div className="flex items-center justify-between"><span>Coordinates</span><span className="font-semibold" style={{ color: "#1a2820" }}>{incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}</span></div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Actions</h2>
              <div className="space-y-3">
                <button onClick={() => navigate("map")} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}>View on Map</button>
                <button onClick={() => navigate("detect")} className="w-full py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>Create New Detection</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
