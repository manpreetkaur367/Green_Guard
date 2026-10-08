import { useState, useEffect } from "react";
import { useRouter } from "../App";
import { SAMPLE_INCIDENTS } from "../data/sample";

const RISK_COLORS = { High: "#dc2626", Medium: "#d97706", Low: "#16a34a" };
const DEFAULT_MAP_URL = "https://www.google.com/maps?q=30.3165,78.0322&z=7&output=embed";

export default function MapPage() {
  const { navigate } = useRouter();
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMarker, setActiveMarker] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [mapUrl, setMapUrl] = useState(DEFAULT_MAP_URL);

  useEffect(() => {
    if (!activeMarker) return;
    const incident = SAMPLE_INCIDENTS.find((entry) => entry.id === activeMarker);
    if (!incident) return;
    setMapUrl(`https://www.google.com/maps?q=${incident.lat},${incident.lng}&z=10&output=embed`);
  }, [activeMarker]);

  const filteredMarkers = SAMPLE_INCIDENTS.filter((inc) => {
    const riskOk = riskFilter === "All" || inc.riskLevel === riskFilter;
    const statusOk = statusFilter === "All" || inc.status === statusFilter;
    return riskOk && statusOk;
  });

  const activeInc = activeMarker ? SAMPLE_INCIDENTS.find((m) => m.id === activeMarker) || null : null;

  return (
    <div className="pt-16 h-screen flex flex-col" style={{ backgroundColor: "#f5f3ee" }}>
      <div className="content-shell py-4 flex items-center gap-4" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #d2ccc0" }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg transition-colors" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Environmental Incident Map</h1>
          <p className="text-xs" style={{ color: "#677870" }}>{filteredMarkers.length} incidents shown — demonstration data only</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search location" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ border: "1px solid #e8e3da" }} />
            <button onClick={async () => {
              if (!searchQuery) return;
              try {
                const q = encodeURIComponent(searchQuery);
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`);
                const list = await res.json();
                setSearchResults(list || []);
                if (list && list[0]) {
                  const lat = parseFloat(list[0].lat);
                  const lon = parseFloat(list[0].lon);
                  setMapUrl(`https://www.google.com/maps?q=${lat},${lon}&z=13&output=embed`);
                  setClickedCoords({ lat, lng: lon });
                }
              } catch (e) {}
            }} className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#1e4d35", color: "#fff" }}>Search</button>
          </div>
          {['High','Medium','Low'].map((r) => (
            <div key={r} className="hidden sm:flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[r] }} /><span className="text-xs" style={{ color: "#677870" }}>{r}</span></div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="overflow-y-auto transition-all duration-300 flex-shrink-0" style={{ width: sidebarOpen ? "320px" : "0px", backgroundColor: "#ffffff", borderRight: "1px solid #d2ccc0", overflow: sidebarOpen ? "auto" : "hidden" }}>
          <div className="p-4" style={{ minWidth: "320px" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#677870" }}>Filters</p>
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: "#677870" }}>Risk Level</p>
              <div className="flex flex-col gap-1.5">
                {['All','High','Medium','Low'].map((r) => (
                  <button key={r} onClick={() => setRiskFilter(r)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left" style={{ backgroundColor: riskFilter === r ? "#e3ede8" : "transparent", color: riskFilter === r ? "#1e4d35" : "#677870" }}>
                    {r !== 'All' && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS[r] }} />}
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: "#677870" }}>Status</p>
              <div className="flex flex-col gap-1.5">
                {['All','Under Review','Verified','Resolved'].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)} className="text-left px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: statusFilter === s ? "#e3ede8" : "transparent", color: statusFilter === s ? "#1e4d35" : "#677870" }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "#677870" }}>Incidents ({filteredMarkers.length})</p>
              <div className="space-y-2">
                {filteredMarkers.map((inc) => (
                  <button key={inc.id} onClick={() => setActiveMarker(activeMarker === inc.id ? null : inc.id)} className="w-full text-left p-3 rounded-xl transition-all" style={{ backgroundColor: activeMarker === inc.id ? "#e3ede8" : "#f5f3ee", border: `1px solid ${activeMarker === inc.id ? "#b8ddc4" : "#e8e3da"}` }}>
                    <div className="flex items-center justify-between mb-1"><span className="text-xs font-bold" style={{ color: "#1e4d35" }}>{inc.id}</span><span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS[inc.riskLevel] }} /></div>
                    <p className="text-xs" style={{ color: "#677870" }}>{inc.city}, {inc.state}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <iframe
            title="GreenGuard incident map"
            src={mapUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold z-10" style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#677870" }}>DEMONSTRATION DATA — SAMPLE INCIDENTS</div>
          {activeInc && (
            <div className="absolute bottom-6 right-6 z-30 w-72 rounded-2xl p-5 shadow-2xl animate-fade-in" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
              <div className="flex items-start justify-between mb-3"><span className="text-sm font-bold" style={{ color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{activeInc.id}</span><button onClick={() => setActiveMarker(null)} className="text-muted-foreground hover:text-foreground"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1a2820" }}>{activeInc.detection}</p>
              <p className="text-xs mb-3" style={{ color: "#677870" }}>{activeInc.city}, {activeInc.state} · {activeInc.date}</p>
              <div className="flex items-center gap-2 mb-4"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: activeInc.riskLevel === "High" ? "#fef2f2" : activeInc.riskLevel === "Medium" ? "#fffbeb" : "#f0fdf4", color: activeInc.riskLevel === "High" ? "#dc2626" : activeInc.riskLevel === "Medium" ? "#d97706" : "#16a34a" }}>{activeInc.riskLevel} Risk</span><span className="text-xs" style={{ color: "#677870" }}>Confidence: {activeInc.confidence}%</span></div>
              {clickedCoords && <div className="text-xs mb-3" style={{ color: "#677870" }}>Selected Coordinates: {clickedCoords.lat.toFixed(5)}, {clickedCoords.lng.toFixed(5)}</div>}
              <button onClick={() => navigate("report-detail", { id: activeInc.id })} className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:shadow-md" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>View Incident</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
