import { useRouter } from "../App";
import { SAMPLE_INCIDENTS } from "../data/sample";

const STATUS_STYLE = {
  "Under Review": { bg: "#eff6ff", color: "#2563eb" },
  Verified: { bg: "#f0fdf4", color: "#16a34a" },
  Rejected: { bg: "#fef2f2", color: "#dc2626" },
  Resolved: { bg: "#f5f3ff", color: "#7c3aed" },
};

export default function Admin() {
  const { navigate } = useRouter();

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="content-shell">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "#677870" }}>Admin Console</p>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Incident Review Desk</h1>
          </div>
          <button onClick={() => navigate("home")} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}>Back to Home</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Open Cases", value: 14, tone: "#1e4d35" },
            { label: "Verified", value: 9, tone: "#16a34a" },
            { label: "Pending Review", value: 5, tone: "#d97706" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: "#677870" }}>{stat.label}</p>
              <p className="text-3xl font-bold mt-3" style={{ color: stat.tone, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "#e8e3da", backgroundColor: "#fafaf8" }}>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Incident Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#fafaf8" }}>
                  {['Incident ID', 'Location', 'Risk', 'Status', 'Reporter', 'Action'].map((heading) => (
                    <th key={heading} className="text-left px-5 py-3.5 text-xs uppercase tracking-wide" style={{ color: "#677870" }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_INCIDENTS.map((incident) => (
                  <tr key={incident.id} style={{ borderTop: "1px solid #e8e3da" }}>
                    <td className="px-5 py-4 font-semibold" style={{ color: "#1e4d35" }}>{incident.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium" style={{ color: "#1a2820" }}>{incident.city}</p>
                      <p className="text-xs" style={{ color: "#677870" }}>{incident.location}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: incident.riskLevel === "High" ? "#fef2f2" : incident.riskLevel === "Medium" ? "#fffbeb" : "#f0fdf4", color: incident.riskLevel === "High" ? "#dc2626" : incident.riskLevel === "Medium" ? "#d97706" : "#16a34a" }}>
                        {incident.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: STATUS_STYLE[incident.status]?.bg || "#f3f4f6", color: STATUS_STYLE[incident.status]?.color || "#374151" }}>{incident.status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#677870" }}>{incident.reporter}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => navigate("report-detail", { id: incident.id })} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
