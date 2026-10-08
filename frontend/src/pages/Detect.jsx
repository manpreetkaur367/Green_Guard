import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "../App";
import { SAMPLE_INCIDENTS } from "../data/sample";
import detectionService from "../services/detectionService";

const PROCESSING_STEPS = [
  "Uploading evidence...",
  "Pre-processing media...",
  "Running object detection...",
  "Calculating risk score...",
  "Preparing report...",
];

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
const MAX_FILE_SIZE_MB = 100;
const DETECTION_TYPE_OPTIONS = ["Tree Cutting", "Tree Damage", "Illegal Logging"];

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatIncidentDate(dateValue) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}

function RiskGauge({ score }) {
  const pct = score / 100;
  const cx = 80, cy = 80, r = 60;
  const arc = 2 * Math.PI * r * 0.75;
  const dashoffset = arc * (1 - pct);
  const color = score >= 70 ? "#dc2626" : score >= 40 ? "#d97706" : "#16a34a";

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="120" viewBox="0 0 160 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8e3da" strokeWidth="12" strokeDasharray={arc} strokeDashoffset={0} strokeLinecap="round" transform="rotate(135, 80, 80)" />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="12" strokeDasharray={arc} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(135, 80, 80)" style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x={cx} y={cy + 6} textAnchor="middle" fill={color} fontSize="26" fontWeight="800" fontFamily="'Plus Jakarta Sans', sans-serif">{score}</text>
        <text x={cx} y={cy + 24} textAnchor="middle" fill="#677870" fontSize="10" fontFamily="Inter, sans-serif">/ 100</text>
      </svg>
      <span className="text-sm font-bold uppercase tracking-widest" style={{ color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {score >= 70 ? "HIGH RISK" : score >= 40 ? "MEDIUM RISK" : "LOW RISK"}
      </span>
    </div>
  );
}

export default function Detect() {
  const { navigate } = useRouter();
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [locationData, setLocationData] = useState({ country: "India", state: "Uttarakhand", city: "Dehradun", area: "Forest Zone A, Sector 4", lat: "30.3165", lng: "78.0322" });
  const [manualLocation, setManualLocation] = useState("Forest Zone A, Sector 4");
  const [detectionType, setDetectionType] = useState("Tree Cutting");
  const [reportData, setReportData] = useState({ title: "Suspected Tree Cutting Activity — Forest Zone A", description: "Multiple cut stumps and timber logs detected in protected forest zone.", date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0, 5), riskLevel: "High" });
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (step !== "location") return;
    try {
      if (typeof L === "undefined") return;
      const map = L.map("detect-map");
      const lat = parseFloat(locationData.lat || "30.3165");
      const lng = parseFloat(locationData.lng || "78.0322");
      map.setView([lat, lng], 10);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
      let marker = null;
      if (selectedLocation) {
        marker = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(map);
      }
      function onMapClick(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
      }
      map.on("click", onMapClick);
      return () => map.remove();
    } catch (e) {}
  }, [step, locationData.lat, locationData.lng, selectedLocation]);

  useEffect(() => {
    setLocationData((previous) => ({
      ...previous,
      area: manualLocation || previous.area,
    }));
  }, [manualLocation]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File too large. Maximum ${MAX_FILE_SIZE_MB}MB allowed.`);
      return;
    }
    if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
      setErrorMsg("Invalid file type. Accepted: JPG, PNG, WEBP, MP4.");
      return;
    }
    setErrorMsg("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setStep("upload");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const openFilePicker = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const clearSelectedFile = () => {
    setFile(null);
    setPreview(null);
    setErrorMsg("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const changeSelectedFile = () => {
    clearSelectedFile();
    openFilePicker();
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setManualLocation(`Current location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLocationData((previous) => ({
          ...previous,
          lat: String(latitude),
          lng: String(longitude),
        }));
        setSelectedLocation({ lat: latitude, lng: longitude });
        setErrorMsg("");
      },
      () => {
        setErrorMsg("Location permission was not granted. You can enter the location manually.");
      }
    );
  };

  const startAnalysis = () => {
    if (!file) { setErrorMsg("Please select a file first."); return; }
    setStep("processing");
    setProcessingStep(0);
    setAnalyzeResult(null);
    const interval = setInterval(() => setProcessingStep((p) => Math.min(p + 1, PROCESSING_STEPS.length - 1)), 700);

    (async () => {
      try {
        const result = await detectionService.analyzeImage(file);
        setAnalyzeResult(result);
        if (result.gps) {
          setLocationData((p) => ({ ...p, lat: String(result.gps.lat), lng: String(result.gps.lng) }));
        }
        clearInterval(interval);
        setProcessingStep(PROCESSING_STEPS.length - 1);
        setTimeout(() => setStep("results"), 600);
      } catch (e) {
        clearInterval(interval);
        setErrorMsg("Analysis failed. Please try again.");
        setStep("upload");
      }
    })();
  };

  const submitReport = () => {
    if (!confirmed) { setErrorMsg("Please confirm the accuracy of the information."); return; }
    setErrorMsg("");
    setStep("success");
  };

  if (step === "processing") {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center animate-spin-slow"
            style={{ border: "3px solid #e3ede8", borderTopColor: "#1e4d35" }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>
            Analyzing Environmental Evidence
          </h2>
          <p className="text-sm mb-10" style={{ color: "#677870" }}>
            GreenGuard analyzes visual indicators such as trees, stumps, timber, and cutting-related objects.
          </p>
          <div className="space-y-3 text-left mb-8">
            {PROCESSING_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: i < processingStep ? "#1e4d35" : i === processingStep ? "#e3ede8" : "#e8e3da",
                  }}
                >
                  {i < processingStep ? (
                    <svg className="w-3 h-3" fill="none" stroke="#f5f3ee" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i === processingStep ? (
                    <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: "#1e4d35" }} />
                  ) : null}
                </div>
                <span className="text-sm" style={{ color: i <= processingStep ? "#1a2820" : "#d2ccc0", fontWeight: i === processingStep ? 600 : 400 }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e8e3da" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${((processingStep + 1) / PROCESSING_STEPS.length) * 100}%`,
                backgroundColor: "#1e4d35",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="content-shell max-w-[1400px]">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-3xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>
                  Detection Analysis
                </h1>
                {analyzeResult ? (
                  analyzeResult.activity_detected ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: "#dc2626" }} />
                      Possible Tree-Cutting Activity Detected
                    </span>
                  ) : analyzeResult.relevant ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#ecfdf5", color: "#166534", border: "1px solid #bbf7d0" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#16a34a" }} />
                      Tree / Forest Detected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#9ca3af" }} />
                      No Tree-Related Activity Detected
                    </span>
                  )
                ) : null}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>
                  DEMO MODE
                </span>
              </div>
            {/* Disclaimer */}
            <div className="flex gap-3 p-4 rounded-xl" style={{ backgroundColor: "#fefce8", border: "1px solid #fde68a" }}>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#d97706" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
                <strong>AI Disclaimer:</strong> These results are preliminary indicators and should be manually reviewed before any enforcement, legal, or disciplinary action.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left — image */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl overflow-hidden relative" style={{ border: "1px solid #d2ccc0" }}>
                {preview ? (
                  file && file.type.startsWith("video/") ? (
                    <video src={preview} controls className="w-full" style={{ maxHeight: "420px" }} />
                  ) : (
                    <div className="relative">
                      <img src={preview} alt="Uploaded evidence" className="w-full object-contain" style={{ maxHeight: "420px" }} />
                      <div className="absolute inset-0" style={{ background: "rgba(18,45,30,0.05)" }} />
                      {analyzeResult && analyzeResult.detections?.map((d, i) => (
                        d.bbox ? (
                          <div key={i} style={{ position: "absolute", left: `${d.bbox[0] * 100}%`, top: `${d.bbox[1] * 100}%`, width: `${d.bbox[2] * 100}%`, height: `${d.bbox[3] * 100}%`, border: `2px solid rgba(34,197,94,0.9)`, boxSizing: "border-box" }} />
                        ) : null
                      ))}
                    </div>
                  )
                ) : (
                  <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=640&h=420&fit=crop&auto=format" alt="Demo detection result" className="w-full object-cover" style={{ height: "420px" }} />
                )}
              </div>

              {/* Detection table */}
              <div className="mt-6 rounded-2xl overflow-hidden" style={{ border: "1px solid #d2ccc0" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #d2ccc0", backgroundColor: "#fafaf8" }}>
                  <h3 className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Detected Objects</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e8e3da", backgroundColor: "#fafaf8" }}>
                      <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#677870" }}>Object</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#677870" }}>Confidence</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#677870" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyzeResult && analyzeResult.detections.length > 0 ? (
                      analyzeResult.detections.map(({ label, confidence }, idx) => (
                        <tr key={`${label}-${idx}`} style={{ borderBottom: "1px solid #e8e3da" }}>
                          <td className="px-5 py-3.5 font-medium" style={{ color: "#1a2820" }}>{label}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e8e3da", maxWidth: "80px" }}>
                                <div className="h-full rounded-full" style={{ width: `${Math.round(confidence)}%`, backgroundColor: "#4ade80" }} />
                              </div>
                              <span className="font-semibold text-xs" style={{ color: "#1a2820" }}>{Math.round(confidence)}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>Detected</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-5 py-6 text-center text-sm" style={{ color: "#677870" }}>{analyzeResult ? analyzeResult.message : "No detections."}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right — summary */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
                <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Detection Summary</h3>
                <div className="flex justify-center mb-4"><RiskGauge score={analyzeResult ? analyzeResult.risk_score : 0} /></div>
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid #e8e3da" }}>
                    <span className="text-xs text-muted-foreground">Overall Confidence</span>
                    <span className="text-sm font-bold" style={{ color: "#1e2820" }}>{analyzeResult && analyzeResult.detections.length > 0 ? Math.round(analyzeResult.detections.reduce((s, d) => s + d.confidence, 0) / analyzeResult.detections.length) + "%" : "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid #e8e3da" }}>
                    <span className="text-xs" style={{ color: "#677870" }}>Objects Detected</span>
                    <span className="text-sm font-bold" style={{ color: "#1a2820" }}>{analyzeResult ? analyzeResult.detections.length : 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs" style={{ color: "#677870" }}>Detection Model</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>YOLOv8 / Demo</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
                <h4 className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "#677870" }}>Detected Indicators</h4>
                <div className="flex flex-wrap gap-2">
                  {analyzeResult && analyzeResult.detections.length > 0 ? (
                    analyzeResult.detections.map((d) => (
                      <span key={d.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#f5f3ee", color: "#1a2820", border: "1px solid #d2ccc0" }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#4ade80" }} />
                        {d.label}
                      </span>
                    ))
                  ) : (
                    <div className="text-xs" style={{ color: "#677870" }}>No indicators detected.</div>
                  )}
                </div>
              </div>

              {analyzeResult && analyzeResult.relevant && analyzeResult.activity_detected ? (
                <button onClick={() => setStep("location")} className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-md active:scale-95" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create Incident Report</button>
              ) : analyzeResult && analyzeResult.relevant && !analyzeResult.activity_detected ? (
                <button onClick={() => {}} className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-md active:scale-95" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Save Observation</button>
              ) : null}

              <button onClick={() => setStep("upload")} className="w-full py-3 rounded-xl text-sm font-medium transition-colors" style={{ color: "#677870", border: "1px solid #d2ccc0", backgroundColor: "transparent" }}>Analyze Another File</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "location") {
    return (
      <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep("results")} className="flex items-center gap-2 text-sm mb-8" style={{ color: "#677870" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Results
          </button>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Where Was This Evidence Captured?</h1>
          <p className="text-sm mb-8" style={{ color: "#677870" }}>Provide the location where the suspected activity was observed.</p>

          <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {(["country", "state", "city", "area"]).map((field) => (
                <div key={field} className={field === "area" ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold mb-1.5 capitalize" style={{ color: "#677870" }}>
                    {field === "area" ? "Area / Landmark" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820", fontFamily: "'Inter', sans-serif" }} value={locationData[field]} onChange={(e) => setLocationData((p) => ({ ...p, [field]: e.target.value }))} onFocus={(e) => { e.currentTarget.style.borderColor = "#1e4d35"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d2ccc0"; }} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {["lat", "lng"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>{field === "lat" ? "Latitude" : "Longitude"}</label>
                  <input className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820" }} value={locationData[field]} onChange={(e) => setLocationData((p) => ({ ...p, [field]: e.target.value }))} onFocus={(e) => { e.currentTarget.style.borderColor = "#1e4d35"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d2ccc0"; }} />
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-5" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }} onClick={() => {
              if (!navigator.geolocation) { setErrorMsg("Geolocation is not supported by this browser."); return; }
              navigator.geolocation.getCurrentPosition((pos) => { const lat = pos.coords.latitude; const lng = pos.coords.longitude; setLocationData((p) => ({ ...p, lat: String(lat), lng: String(lng) })); setSelectedLocation({ lat, lng }); }, () => { setErrorMsg("Location permission was not granted. You can select the incident location manually on the map."); });
            }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Use Current Location
            </button>

            <div id="detect-map" className="w-full h-48 rounded-xl mb-5" style={{ border: "1px solid #d2ccc0" }} />
          </div>

          <button onClick={() => { if (selectedLocation) { setLocationData((p) => ({ ...p, lat: String(selectedLocation.lat), lng: String(selectedLocation.lng) })); } setStep("report"); }} className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-md" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Continue to Report</button>
        </div>
      </div>
    );
  }

  if (step === "report") {
    return (
      <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="content-shell max-w-[1200px]">
          <button onClick={() => setStep("location")} className="flex items-center gap-2 text-sm mb-8" style={{ color: "#677870" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Location
          </button>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Create Environmental Incident Report</h1>
          <p className="text-sm mb-8" style={{ color: "#677870" }}>Complete the form below to formally document this environmental incident.</p>

          <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>Incident Title</label>
                <input className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820" }} value={reportData.title} onChange={(e) => setReportData((p) => ({ ...p, title: e.target.value }))} onFocus={(e) => { e.currentTarget.style.borderColor = "#1e4d35"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d2ccc0"; }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>Description</label>
                <textarea className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" rows={4} style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820" }} value={reportData.description} onChange={(e) => setReportData((p) => ({ ...p, description: e.target.value }))} onFocus={(e) => { e.currentTarget.style.borderColor = "#1e4d35"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d2ccc0"; }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>Date</label>
                  <input type="date" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820" }} value={reportData.date} onChange={(e) => setReportData((p) => ({ ...p, date: e.target.value }))} onFocus={(e) => { e.currentTarget.style.borderColor = "#1e4d35"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d2ccc0"; }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>Time</label>
                  <input type="time" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820" }} value={reportData.time} onChange={(e) => setReportData((p) => ({ ...p, time: e.target.value }))} onFocus={(e) => { e.currentTarget.style.borderColor = "#1e4d35"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d2ccc0"; }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>Location</label>
                <input readOnly className="w-full px-3.5 py-2.5 rounded-xl text-sm" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#f0ede6", color: "#677870" }} value={`${locationData.area}, ${locationData.city}, ${locationData.state}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>Detection Result</label>
                <input readOnly className="w-full px-3.5 py-2.5 rounded-xl text-sm" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#f0ede6", color: "#677870" }} value="Possible Tree-Cutting Activity Detected — 4 objects (Demo)" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#677870" }}>Risk Level</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820" }} value={reportData.riskLevel} onChange={(e) => setReportData((p) => ({ ...p, riskLevel: e.target.value }))}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <label className="flex items-start gap-3 cursor-pointer mt-2">
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded" style={{ accentColor: "#1e4d35" }} checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                <span className="text-xs leading-relaxed" style={{ color: "#677870" }}>I confirm that the information provided is accurate to the best of my knowledge and understand that AI results require human verification before any enforcement action.</span>
              </label>

              {errorMsg && (<p className="text-xs font-medium" style={{ color: "#dc2626" }}>{errorMsg}</p>)}
            </div>
          </div>

          <button onClick={submitReport} className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-md" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Submit Report</button>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ backgroundColor: "#e3ede8" }}>
            <svg className="w-10 h-10" fill="none" stroke="#1e4d35" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Incident Report Submitted</h1>
          <p className="text-sm mb-10" style={{ color: "#677870" }}>Your environmental incident has been successfully recorded for review.</p>

          <div className="rounded-2xl p-6 mb-8 text-left" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: "#1a2820", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Incident ID</span>
              <span className="text-lg font-bold" style={{ color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GG-2026-00427</span>
            </div>
            {[{ label: "Date", value: reportData.date }, { label: "Location", value: `${locationData.city}, ${locationData.state}` }, { label: "Risk Level", value: reportData.riskLevel }, { label: "Status", value: "Under Review" }].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2.5" style={{ borderTop: "1px solid #e8e3da" }}>
                <span className="text-xs" style={{ color: "#677870" }}>{label}</span>
                <span className="text-sm font-semibold" style={{ color: "#1a2820" }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate("reports")} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>View Reports</button>
            <button onClick={() => navigate("home")} className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors" style={{ border: "1px solid #d2ccc0", color: "#677870" }}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // Upload step
  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>AI Tree-Cutting Detection</h1>
          <p className="text-base max-w-3xl" style={{ color: "#677870" }}>Upload visual evidence, define the suspected issue, and analyze it for environmental risk indicators.</p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mt-3" style={{ backgroundColor: "rgba(30,77,53,0.1)", color: "#1e4d35", border: "1px solid rgba(30,77,53,0.2)", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.05em" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: "#3d7a52" }} />
            DEMO MODE — Results are simulated for demonstration
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_420px] gap-6 items-start mb-6">
          <div className="rounded-3xl p-5 sm:p-6 lg:p-7" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0", boxShadow: "0 18px 45px rgba(26,40,32,0.04)" }}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Evidence Intake</h2>
                <p className="text-sm" style={{ color: "#677870" }}>Drop media here or browse your device, then define the suspected incident details.</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#f5f3ee", color: "#1e4d35", border: "1px solid #d2ccc0" }}>
                Max file size: {MAX_FILE_SIZE_MB} MB
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.mp4,image/jpeg,image/png,image/webp,video/mp4"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />

            <div
              className={`rounded-3xl p-5 sm:p-7 transition-all ${dragOver ? "scale-[1.01]" : ""}`}
              style={{
                backgroundColor: dragOver ? "#f8faf8" : "#fafaf8",
                border: `1.5px dashed ${dragOver ? "#1e4d35" : "#d2ccc0"}`,
              }}
              onClick={openFilePicker}
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openFilePicker();
                }
              }}
            >
              {!file ? (
                <div className="flex flex-col items-center text-center gap-4 py-6 sm:py-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#e3ede8" }}>
                    <svg className="w-8 h-8" fill="none" stroke="#1e4d35" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.902A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Drag & drop image or video here</h3>
                    <p className="text-sm mb-2" style={{ color: "#677870" }}>or browse from your device</p>
                    <p className="text-xs" style={{ color: "#677870" }}>Supported formats: JPG, PNG, WEBP, MP4</p>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); openFilePicker(); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Browse Files</button>
                  <p className="text-xs max-w-md leading-relaxed" style={{ color: "#8b8b7a" }}>Drop a single file to generate a simulated AI detection summary and incident workflow preview.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)] gap-5 items-start">
                  <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#f5f3ee", border: "1px solid #e8e3da" }}>
                    {preview && file.type.startsWith("video/") ? (
                      <video src={preview} controls className="w-full block bg-black" style={{ maxHeight: "360px" }} />
                    ) : preview ? (
                      <img src={preview} alt="Uploaded evidence preview" className="w-full block object-contain" style={{ maxHeight: "360px" }} />
                    ) : null}
                  </div>

                  <div className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: "#fafaf8", border: "1px solid #e8e3da" }}>
                    <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: "#677870" }}>Selected File</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold break-all" style={{ color: "#1a2820" }}>{file.name}</p>
                        <p className="text-xs mt-1" style={{ color: "#677870" }}>{formatFileSize(file.size)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={(event) => { event.stopPropagation(); changeSelectedFile(); }} className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>Change File</button>
                        <button type="button" onClick={(event) => { event.stopPropagation(); clearSelectedFile(); }} className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors" style={{ backgroundColor: "#f5f3ee", color: "#677870", border: "1px solid #d2ccc0" }}>Remove</button>
                      </div>
                      <div className="rounded-xl p-3" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e3da" }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#677870" }}>Accepted formats</p>
                        <p className="text-xs" style={{ color: "#1a2820" }}>JPG, PNG, WEBP, MP4</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-[0.18em]" style={{ color: "#677870" }}>Detection Type</label>
                <select
                  className="w-full px-3.5 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  value={detectionType}
                  onChange={(e) => setDetectionType(e.target.value)}
                >
                  {DETECTION_TYPE_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-[0.18em]" style={{ color: "#677870" }}>Location</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    className="w-full px-3.5 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid #d2ccc0", backgroundColor: "#fafaf8", color: "#1a2820" }}
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="Enter a site, forest zone, or landmark"
                  />
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                    style={{ backgroundColor: "#e3ede8", color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Use current location
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="text-xs leading-relaxed max-w-2xl" style={{ color: "#677870" }}>
                AI results are indicative only. All suspected incidents require human verification.
              </div>
              <button
                type="button"
                onClick={startAnalysis}
                disabled={!file}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  backgroundColor: file ? "#1e4d35" : "#cfd7d1",
                  color: file ? "#f5f3ee" : "#7c8a82",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: file ? "pointer" : "not-allowed",
                }}
              >
                Analyze Evidence →
              </button>
            </div>

            {errorMsg && (
              <p className="mt-4 text-xs font-medium" style={{ color: "#dc2626" }}>
                {errorMsg}
              </p>
            )}
          </div>

          <div className="rounded-3xl p-5 sm:p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0", boxShadow: "0 18px 45px rgba(26,40,32,0.04)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>How Detection Works</h3>
            <p className="text-sm mb-5" style={{ color: "#677870" }}>A streamlined overview of how the demo pipeline turns uploaded evidence into an incident assessment.</p>

            <div className="space-y-3">
              {[
                { step: "01", title: "Upload Evidence", text: "Provide image or video proof from the field." },
                { step: "02", title: "AI Analyzes Evidence", text: "The demo model scans for environmental indicators." },
                { step: "03", title: "Risk Indicators Detected", text: "Objects, confidence, and risk scores are summarized." },
                { step: "04", title: "Generate Incident Report", text: "Results flow into the reporting workflow for review." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 p-3 rounded-2xl" style={{ backgroundColor: "#fafaf8", border: "1px solid #e8e3da" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#e3ede8", color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "#1a2820" }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#677870" }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="rounded-3xl p-5 sm:p-6 lg:p-7 mb-6" style={{ backgroundColor: "#ffffff", border: "1px solid #d2ccc0", boxShadow: "0 18px 45px rgba(26,40,32,0.04)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Recent Detections</h2>
              <p className="text-sm" style={{ color: "#677870" }}>Example AI detections available in the GreenGuard demo workspace.</p>
            </div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}>Demo entries</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_INCIDENTS.slice(0, 3).map((incident) => (
              <div key={incident.id} className="rounded-2xl p-4 flex flex-col h-full" style={{ backgroundColor: "#fafaf8", border: "1px solid #e8e3da" }}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] mb-2" style={{ color: "#677870" }}>Detection Type</p>
                    <h3 className="text-base font-semibold leading-tight" style={{ color: "#1a2820" }}>{incident.detection}</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: incident.riskLevel === "High" ? "#fef2f2" : incident.riskLevel === "Medium" ? "#fffbeb" : "#f0fdf4", color: incident.riskLevel === "High" ? "#dc2626" : incident.riskLevel === "Medium" ? "#d97706" : "#16a34a" }}>
                    {incident.riskLevel} Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="rounded-xl p-3" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e3da" }}>
                    <p className="text-xs mb-1" style={{ color: "#677870" }}>Confidence</p>
                    <p className="text-sm font-semibold" style={{ color: "#1a2820" }}>{incident.confidence}%</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e3da" }}>
                    <p className="text-xs mb-1" style={{ color: "#677870" }}>Date</p>
                    <p className="text-sm font-semibold" style={{ color: "#1a2820" }}>{formatIncidentDate(incident.date)}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#677870" }}>Report ID</p>
                    <p className="text-xs font-semibold" style={{ color: "#1a2820" }}>{incident.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("report-detail", { id: incident.id })}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                    style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
