import { useState } from "react";
import { useRouter } from "../App";
import { SAMPLE_INCIDENTS } from "../data/sample";

function RiskBadge({ level }) {
  const map = {
    High: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    Medium: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
    Low: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  };
  const s = map[level];
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />
      {level}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Under Review": { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
    Verified: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
    Rejected: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    Resolved: { bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {status}
    </span>
  );
}

export default function Reports() {
  const { navigate } = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const FILTERS = ["All", "High Risk", "Medium Risk", "Low Risk", "Under Review", "Verified", "Resolved"];

  const filtered = SAMPLE_INCIDENTS.filter((inc) => {
    const q = search.toLowerCase();
    const matchSearch = !q || inc.id.toLowerCase().includes(q) || inc.city.toLowerCase().includes(q) || inc.location.toLowerCase().includes(q);
    const matchFilter =
      filter === "All" ||
      (filter === "High Risk" && inc.riskLevel === "High") ||
      (filter === "Medium Risk" && inc.riskLevel === "Medium") ||
      (filter === "Low Risk" && inc.riskLevel === "Low") ||
      (filter === "Under Review" && inc.status === "Under Review") ||
      (filter === "Verified" && inc.status === "Verified") ||
      (filter === "Resolved" && inc.status === "Resolved");
    return matchSearch && matchFilter;
  });

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="content-shell">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>
              Environmental Incident Reports
            </h1>
            <p className="text-sm" style={{ color: "#677870" }}>{SAMPLE_INCIDENTS.length} total records — marked as demonstration data</p>
          </div>
          <button onClick={() => navigate("detect")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Detection
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative max-w-lg">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#677870" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#ffffff", color: "#1a2820" }} placeholder="Search incident ID, location or city..." value={search} onChange={(e) => setSearch(e.target.value)} onFocus={(e) => { e.currentTarget.style.borderColor = "#1e4d35"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d2ccc0"; }} />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all" style={{ backgroundColor: filter === f ? "#1e4d35" : "#ffffff", color: filter === f ? "#f5f3ee" : "#677870", border: `1.5px solid ${filter === f ? "#1e4d35" : "#d2ccc0"}`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 text-xs" style={{ backgroundColor: "#e3ede8", border: "1px solid #b8ddc4" }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#1e4d35" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ color: "#1e4d35", fontWeight: 500 }}>All records shown are demonstration data. Connect to MongoDB backend for live incident management.</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#e8e3da" }}>
              <svg className="w-8 h-8" fill="none" stroke="#677870" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>No incidents found</h3>
            <p className="text-sm mb-4" style={{ color: "#677870" }}>Try adjusting your search or filters.</p>
            <button onClick={() => { setSearch(""); setFilter("All"); }} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>Clear Filters</button>
          </div>
        ) : (
          <> 
            <div className="hidden lg:block rounded-2xl overflow-hidden" style={{ border: "1px solid #d2ccc0" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #e8e3da" }}>
                    {["Incident ID", "Date", "Location", "Detection", "Risk", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "#677870" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inc, i) => (
                    <tr key={inc.id} className="group transition-colors hover:bg-forest-50" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #e8e3da" : "none" }}>
                      <td className="px-5 py-4"><span className="font-bold text-xs" style={{ color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{inc.id}</span></td>
                      <td className="px-5 py-4"><div><p className="text-xs font-medium" style={{ color: "#1a2820" }}>{inc.date}</p><p className="text-xs" style={{ color: "#677870" }}>{inc.time}</p></div></td>
                      <td className="px-5 py-4"><div><p className="text-xs font-medium" style={{ color: "#1a2820" }}>{inc.city}</p><p className="text-xs" style={{ color: "#677870" }}>{inc.state}</p></div></td>
                      <td className="px-5 py-4 text-xs" style={{ color: "#677870", maxWidth: "180px" }}><p className="truncate">{inc.detection}</p></td>
                      <td className="px-5 py-4"><RiskBadge level={inc.riskLevel} /></td>
                      <td className="px-5 py-4"><StatusBadge status={inc.status} /></td>
                      <td className="px-5 py-4"><button onClick={() => navigate("report-detail", { id: inc.id })} className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors" style={{ color: "#1e4d35", backgroundColor: "#e3ede8" }}>View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filtered.map((inc) => (
                <div key={inc.id} className="rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-bold text-sm" style={{ color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{inc.id}</span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: "#1a2820" }}>{inc.detection}</p>
                  <p className="text-xs mb-3" style={{ color: "#677870" }}>{inc.city}, {inc.state} · {inc.date}</p>
                  <div className="flex items-center justify-between">
                    <RiskBadge level={inc.riskLevel} />
                    <button onClick={() => navigate("report-detail", { id: inc.id })} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: "#1e4d35", backgroundColor: "#e3ede8" }}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
