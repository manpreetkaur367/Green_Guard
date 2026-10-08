import { useEffect, useRef, useState } from "react";
import { useRouter } from "../App";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function AnimatedSection({ children, className = "", delay = 0 }) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const HERO_FEATURES = ["AI Detection", "Risk Assessment", "Location Tracking", "Human Review"];

const FEATURE_STRIP = [
  { src: "/images/forest-monitoring.jpg", title: "Forest Monitoring" },
  { src: "/images/forest-ranger.jpg", title: "Forest Ranger" },
  { src: "/images/wildlife-protection.jpg", title: "Wildlife Protection" },
  { src: "/images/deforestation.jpg", title: "Environmental Detection" },
  { src: "/images/satellite-monitoring.jpg", title: "Remote Monitoring" },
];

const WHY_GREENGUARD = [
  {
    icon: "🌲",
    title: "AI Forest Detection",
    description: "Analyze uploaded images and identify potential environmental threats with computer-vision-assisted review.",
  },
  {
    icon: "⚠️",
    title: "Risk Assessment",
    description: "Evaluate observed signals and generate a clearer threat assessment for review and action.",
  },
  {
    icon: "📍",
    title: "Location Intelligence",
    description: "Link observations to geospatial context so incidents are easier to understand and investigate.",
  },
  {
    icon: "👤",
    title: "Human Verification",
    description: "Keep important detections in a human review workflow for more responsible decision-making.",
  },
];

const WORKFLOW_STEPS = [
  { number: "01", title: "Upload Evidence", desc: "Capture and submit images from a suspected location or field observation." },
  { number: "02", title: "AI Analysis", desc: "The platform evaluates visual evidence for environmental indicators and risk patterns." },
  { number: "03", title: "Risk Assessment", desc: "Detected signals are translated into a review-ready risk assessment summary." },
  { number: "04", title: "Location", desc: "Each observation is tied to location detail and incident context for better clarity." },
  { number: "05", title: "Incident Report", desc: "Evidence and findings are organized into a clear and actionable report." },
  { number: "06", title: "Human Review", desc: "Prepared reports remain available for human validation and further investigation." },
];

const INTELLIGENCE_CARDS = [
  { label: "Detection Status", value: "AI Analysis Ready" },
  { label: "Risk Level", value: "Requires Review" },
  { label: "Location", value: "Incident Coordinates Available" },
  { label: "Report Status", value: "Pending Verification" },
];

const CAPABILITIES = [
  { title: "Computer Vision", description: "AI-assisted image analysis for environmental evidence and anomaly detection." },
  { title: "Risk Assessment", description: "Identify possible patterns and categorize potential threat levels more consistently." },
  { title: "Geographic Tracking", description: "Attach incidents to location data to improve clarity and area-based investigation." },
  { title: "Incident Reporting", description: "Convert observations into structured, review-ready reports for follow-up." },
  { title: "Human Verification", description: "Support responsible review by keeping people in the decision loop." },
  { title: "Evidence Management", description: "Keep photos, findings, and context organized across review stages." },
];

const FUTURE_CAPABILITIES = [
  { icon: "🚁", title: "Drone Monitoring", description: "AI-assisted UAV patrols for remote forest areas." },
  { icon: "🛰️", title: "Satellite Analysis", description: "Regional change detection for environmental monitoring at scale." },
  { icon: "📹", title: "Forest CCTV", description: "Fixed monitoring points for continuous awareness and alerts." },
  { icon: "🔔", title: "Real-Time Alerts", description: "Immediate notifications for high-risk detections and field response." },
  { icon: "📱", title: "Mobile Field Reporting", description: "Simple capture tools for rangers and field teams in low-connectivity settings." },
  { icon: "🤖", title: "AI Change Detection", description: "Compare imagery over time to detect changing land and forest conditions." },
];

const MONITORING_CARDS = [
  {
    title: "Forest Monitoring",
    description: "Monitor suspicious activity across forest areas and respond earlier with clearer field awareness.",
    image: "/images/forest-monitoring.jpg",
  },
  {
    title: "Wildlife Protection",
    description: "Support detection efforts that help protect habitats and the species that depend on them.",
    image: "/images/wildlife-protection.jpg",
  },
  {
    title: "Deforestation Awareness",
    description: "Document environmental change and help teams assess risk with stronger visual evidence.",
    image: "/images/deforestation.jpg",
  },
];

export default function Home() {
  const { navigate } = useRouter();

  return (
    <div className="bg-[#f5f3ee] pb-20 pt-16">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(130,190,146,0.16),_transparent_28%),linear-gradient(135deg,#183d2a_0%,#1f4d39_35%,#102d1e_100%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative content-shell grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#dfeee3] backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[#9ad5a4]" />
              AI-POWERED FOREST PROTECTION
            </div>

            <h1
              className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-[4rem]"
              style={{ letterSpacing: "-0.04em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Protect Forests with Intelligent Detection
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#dfeee3]">
              GreenGuard combines AI-powered image analysis, risk assessment, location tracking, and incident reporting to help identify and document potential threats to forest ecosystems.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("detect")}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold text-[#163f2d] shadow-[0_16px_30px_rgba(12,32,23,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(12,32,23,0.35)]"
                style={{ backgroundColor: "#edf5ef" }}
              >
                Start Detection →
              </button>
              <button
                onClick={() => navigate("reports")}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5"
              >
                Explore Reports
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#dfeee3]">
              {HERO_FEATURES.map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#9ad5a4] text-[10px] text-[#123125]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[32px] bg-[#9ad5a4]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-[0_28px_60px_rgba(6,20,14,0.38)] backdrop-blur-sm">
              <img src="/images/forest-hero.jpg" alt="Dense forest landscape" className="h-[500px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2519]/70 via-[#0f2519]/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 rounded-2xl border border-white/10 bg-[#f5f3ee]/10 p-4 backdrop-blur-md">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dfeee3]">Forest Intelligence</div>
                  <div className="mt-2 text-lg font-bold text-white">Monitoring in real time</div>
                </div>
                <div className="rounded-full border border-[#9ad5a4]/30 bg-[#dff4e2]/10 px-3 py-1.5 text-xs font-medium text-[#dff4e2]">
                  24/7 monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-3 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FEATURE_STRIP.map(({ src, title }) => (
              <div key={title} className="group relative overflow-hidden rounded-[24px] border border-[#d8d2c7] bg-white shadow-[0_16px_28px_rgba(18,43,30,0.05)]">
                <img src={src} alt={title} className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2519]/70 via-[#0f2519]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-sm font-semibold text-white">{title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Why GreenGuard?</p>
            <h2
              className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Smarter Technology for Forest Protection
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#677870]">
              From visual evidence to verified reports, GreenGuard helps transform environmental observations into actionable information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {WHY_GREENGUARD.map(({ icon, title, description }, index) => (
              <AnimatedSection key={title} delay={index * 120}>
                <div className="h-full rounded-[28px] border border-[#d8d2c7] bg-white p-6 shadow-[0_16px_30px_rgba(18,43,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(18,43,30,0.08)]">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5ef] text-2xl shadow-inner shadow-white/90">
                    {icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-[#677870]">{description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#edf5ef] px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-[30px] border border-[#d8d2c7] bg-white shadow-[0_22px_40px_rgba(18,43,30,0.05)]">
              <img src="/images/forest-hero.jpg" alt="Forest monitoring image" className="h-[470px] w-full object-cover" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Environmental Intelligence</p>
              <h2
                className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl"
                style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Turning Visual Evidence Into Action
              </h2>
              <p className="mt-5 text-base leading-7 text-[#677870]">
                GreenGuard gives environmental teams a simple path from observed evidence to structured, location-aware incident information. Users can submit imagery, review detection results, and prepare better-informed reports with clearer context.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-[#1a2820]">
                {[
                  "Upload images",
                  "AI-powered analysis",
                  "Risk scoring",
                  "Location information",
                  "Structured reporting",
                  "Human review",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dfeee3] text-[10px] font-bold text-[#1e4d35]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("detect")}
                className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold text-[#f5f3ee] shadow-[0_16px_30px_rgba(30,77,53,0.2)] transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "#1e4d35" }}
              >
                Start Detection →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">How GreenGuard Works</p>
            <h2
              className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              From evidence to informed environmental response.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-6">
            {WORKFLOW_STEPS.map(({ number, title, desc }, index) => (
              <div key={number} className="relative">
                <div className="rounded-[24px] border border-[#d8d2c7] bg-white p-5 shadow-[0_16px_28px_rgba(18,43,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(18,43,30,0.08)]">
                  <div className="mb-4 inline-flex rounded-full bg-[#edf5ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e4d35]">
                    {number}
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-[#677870]">{desc}</p>
                </div>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden h-1 w-8 bg-[#bfd8c3] lg:absolute lg:-right-1 lg:top-1/2 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1a2820] px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#87c49e]">Live Environmental Intelligence</p>
            <h2
              className="mt-4 text-3xl font-black text-[#f5f3ee] sm:text-4xl"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Insights from evidence to action.
            </h2>
          </div>

          <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[30px] border border-white/10 bg-[#112d1e] p-4 shadow-[0_24px_48px_rgba(2,12,9,0.22)]">
              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#153a2c]">
                <div className="h-[330px] w-full bg-[radial-gradient(circle_at_center,_rgba(140,211,160,0.18),_transparent_55%),linear-gradient(180deg,#183d2a_0%,#123125_100%)]" />
                <div className="absolute inset-0">
                  <div className="absolute left-12 top-14 h-3 w-3 rounded-full bg-[#facc15] shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                  <div className="absolute left-24 top-28 h-3 w-3 rounded-full bg-[#f97316] shadow-[0_0_14px_rgba(249,115,22,0.8)]" />
                  <div className="absolute right-24 top-20 h-3 w-3 rounded-full bg-[#facc15] shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                  <div className="absolute right-16 top-40 h-3 w-3 rounded-full bg-[#dc2626] shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-[#3d7a52] shadow-[0_0_12px_rgba(61,122,82,0.8)]" />
                </div>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 330" preserveAspectRatio="none">
                  <path d="M50 250 C160 150, 220 170, 320 200 S480 220, 560 160 S760 180, 780 140" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="10 12" />
                  <path d="M40 210 C180 150, 240 230, 360 180 S560 180, 760 220" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="grid gap-4">
              {INTELLIGENCE_CARDS.map(({ label, value }) => (
                <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9ad5a4]">{label}</div>
                  <div className="mt-2 text-lg font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">See What GreenGuard Helps Monitor</p>
            <h2
              className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Environmental patterns and field situations worth understanding.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {MONITORING_CARDS.map(({ title, description, image }) => (
              <div key={title} className="group relative overflow-hidden rounded-[30px] border border-[#d8d2c7] bg-white shadow-[0_18px_30px_rgba(18,43,30,0.05)]">
                <img src={image} alt={title} className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2519]/80 via-[#0f2519]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#dfeee3]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f6f1] px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Key Capabilities</p>
            <h2
              className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              What GreenGuard is designed to support.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {CAPABILITIES.map(({ title, description }, index) => (
              <AnimatedSection key={title} delay={index * 90}>
                <div className="h-full rounded-[26px] border border-[#d8d2c7] bg-white p-6 shadow-[0_16px_28px_rgba(18,43,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(18,43,30,0.08)]">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ef] text-lg text-[#1e4d35]">
                    •
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-[#677870]">{description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-[30px] border border-[#d8d2c7] bg-white p-4 shadow-[0_22px_40px_rgba(18,43,30,0.05)]">
              <div className="relative overflow-hidden rounded-[24px] border border-[#d8d2c7] bg-[#edf5ef]">
                <img src="/images/satellite-monitoring.jpg" alt="Map style forest monitoring preview" className="h-[380px] w-full object-cover" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0,_transparent_40%,_rgba(13,29,22,0.1)_100%)]" />
                <div className="absolute left-10 top-12 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1e4d35] shadow-lg">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
                  Incident Marker
                </div>
                <div className="absolute bottom-10 left-16 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1e4d35] shadow-lg">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#d97706]" />
                  Area Review
                </div>
                <div className="absolute right-12 top-24 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1e4d35] shadow-lg">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
                  Active Zone
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Monitor Environmental Incidents</p>
              <h2
                className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl"
                style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Location-Aware Reporting
              </h2>
              <p className="mt-5 text-base leading-7 text-[#677870]">
                Every environmental observation can be connected with geographic information, making incidents easier to understand, review, and act on.
              </p>

              <div className="mt-6 space-y-3 text-sm text-[#1a2820]">
                {[
                  "📍 Location tracking",
                  "🗺️ Geographic visualization",
                  "📌 Incident markers",
                  "🔎 Area-based investigation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#d8d2c7] bg-white p-3">
                    <span className="text-base">{item.split(" ")[0]}</span>
                    <span>{item.replace(/^\S+\s/, "")}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("map")}
                className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold text-[#f5f3ee] shadow-[0_16px_30px_rgba(30,77,53,0.2)] transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "#1e4d35" }}
              >
                Open Map →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f6f1] px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Future of Forest Protection</p>
            <h2
              className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Building the future of environmental monitoring.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {FUTURE_CAPABILITIES.map(({ icon, title, description }, index) => (
              <AnimatedSection key={title} delay={index * 90}>
                <div className="h-full rounded-[28px] border border-[#d8d2c7] bg-white p-6 shadow-[0_18px_30px_rgba(18,43,30,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_38px_rgba(18,43,30,0.09)]">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5ef] text-2xl">
                    {icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-[#677870]">{description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-[#d5e0d8] bg-[#163f2d] shadow-[0_22px_48px_rgba(18,43,30,0.10)]">
          <div className="relative isolate overflow-hidden">
            <img src="/images/forest-monitoring.jpg" alt="Forest background" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(18,45,30,0.9),rgba(21,66,48,0.82))]" />
            <div className="relative px-6 py-14 text-center sm:px-10 lg:px-14">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9ad5a4]">Take Action</p>
              <h2
                className="mt-4 text-3xl font-black text-[#f5f3ee] sm:text-4xl"
                style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Help Protect Our Forests
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#dfeee3]">
                Start with evidence. Detect potential threats. Create actionable reports.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("detect")}
                  className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-bold text-[#163f2d] shadow-[0_16px_30px_rgba(12,32,23,0.28)] transition-all duration-200 hover:-translate-y-0.5"
                  style={{ backgroundColor: "#edf5ef" }}
                >
                  Start Detection →
                </button>
                <button
                  onClick={() => navigate("reports")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5"
                >
                  Explore Reports →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
