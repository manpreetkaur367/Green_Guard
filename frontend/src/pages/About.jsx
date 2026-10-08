import { useRouter } from "../App";

const WHY_GREENGUARD = [
  {
    icon: "🌲",
    title: "Protect Forests",
    description: "Detect suspicious activities and potential forest threats before they escalate into lasting environmental damage.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Detection",
    description: "Use computer vision to analyze uploaded evidence and identify signs of environmental incidents and deforestation patterns.",
  },
  {
    icon: "📍",
    title: "Location-Based Reporting",
    description: "Track incidents geographically to understand where threats are emerging and help teams respond with clearer situational awareness.",
  },
];

const IMAGE_GALLERY = [
  { src: "/images/forest-hero.jpg", title: "Forest canopy", className: "md:col-span-2 md:row-span-2" },
  { src: "/images/forest-monitoring.jpg", title: "Forest monitoring", className: "" },
  { src: "/images/wildlife-protection.jpg", title: "Wildlife protection", className: "" },
  { src: "/images/forest-ranger.jpg", title: "Ranger patrol", className: "md:col-span-2" },
  { src: "/images/satellite-monitoring.jpg", title: "Remote monitoring", className: "" },
  { src: "/images/deforestation.jpg", title: "Deforestation awareness", className: "md:col-span-2" },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Upload Evidence",
    description: "Users upload an image or video related to a suspected incident to begin the review process.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "The system evaluates the submitted material to identify potential signs of risk, activity, or environmental damage.",
  },
  {
    number: "03",
    title: "Human Verification",
    description: "Important detections are reviewed by humans to confirm context and reduce false positives.",
  },
  {
    number: "04",
    title: "Incident Reporting",
    description: "Valid reports are organized with incident details, location context, and supporting evidence for review.",
  },
];

const TECHNOLOGY = [
  { icon: "🧠", title: "Computer Vision", description: "Image processing to identify patterns, objects, and visible environmental indicators." },
  { icon: "📡", title: "AI Detection", description: "Model-driven assessment of submitted evidence to flag possible forest-related incidents." },
  { icon: "📍", title: "Geolocation", description: "Connect reports to specific places so threats can be mapped and understood geographically." },
  { icon: "🧾", title: "Incident Reporting", description: "Organize relevant findings into structured evidence for communication and follow-up." },
  { icon: "📊", title: "Data Visualization", description: "Turn incident data into visual dashboards that help teams monitor trends and hotspots." },
  { icon: "✅", title: "Human Verification", description: "Keep the final review process accountable, transparent, and grounded in expert judgment." },
];

const IMPACT = [
  { title: "AI-Assisted Detection", description: "Helps surface suspicious activity early so teams can investigate before risks escalate." },
  { title: "Location-Based Reports", description: "Supports clearer documentation of where environmental threats are emerging and recurring." },
  { title: "Human Verification", description: "Adds accountability and review so findings are interpreted with context and care." },
  { title: "Forest Protection Focus", description: "Keeps attention on real environmental outcomes and the people protecting vulnerable ecosystems." },
];

const APPROACH = [
  { step: "Detect", description: "Identify potential environmental threats through evidence and automated analysis." },
  { step: "Verify", description: "Review findings with human oversight to confirm context and reduce uncertainty." },
  { step: "Report", description: "Turn verified evidence into structured incident records with location and supporting details." },
  { step: "Protect", description: "Support faster action and better coordination for forest conservation and response." },
];

const STORY_CARDS = [
  {
    title: "Forest Monitoring",
    description: "Continuous observation helps teams understand changing landscapes and surface suspicious activity earlier.",
    image: "/images/forest-monitoring.jpg",
  },
  {
    title: "Wildlife Protection",
    description: "Healthy forests sustain biodiversity, and better monitoring supports efforts to protect habitats and species.",
    image: "/images/wildlife-protection.jpg",
  },
  {
    title: "Environmental Awareness",
    description: "Clear evidence and reporting tools help communities and institutions act with greater awareness and speed.",
    image: "/images/forest-hero.jpg",
  },
];

export default function About() {
  const { navigate } = useRouter();

  return (
    <div className="pt-20 pb-24 bg-[#f5f3ee]">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(130,190,146,0.18),_transparent_30%),linear-gradient(135deg,#183d2a_0%,#1f4d39_35%,#123125_100%)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative content-shell grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#dfeee3] backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[#9ad5a4]" />
              AI-Powered Forest Protection
            </div>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-[3.6rem]" style={{ letterSpacing: "-0.04em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Technology Built for Forest Protection
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#dfeee3]">
              GreenGuard helps communities, rangers, and environmental teams detect potential threats using computer vision, geographic tracking, and incident reporting tools designed for real-world forest protection.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("detect")}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold shadow-[0_16px_28px_rgba(12,32,23,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_35px_rgba(12,32,23,0.32)]"
                style={{ backgroundColor: "#edf5ef", color: "#163f2d" }}
              >
                Start Detection
              </button>
              <button
                onClick={() => navigate("reports")}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/6"
              >
                Explore Reports
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[30px] bg-[#9ad5a4]/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/8 shadow-[0_28px_60px_rgba(6,20,14,0.35)] backdrop-blur-sm">
              <img src="/images/forest-hero.jpg" alt="Forest landscape" className="h-[460px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2519]/60 via-[#0f2519]/10 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 rounded-2xl border border-white/12 bg-[#f5f3ee]/10 p-4 backdrop-blur-md">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#dfeee3]">Forest Watch</div>
                  <div className="mt-2 text-lg font-bold text-white">Evidence-led protection</div>
                </div>
                <div className="rounded-full border border-[#9ad5a4]/30 bg-[#dff4e2]/10 px-3 py-1.5 text-xs font-medium text-[#dff4e2]">
                  Live monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Why GreenGuard?</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              A clearer way to monitor and protect forests.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {WHY_GREENGUARD.map(({ icon, title, description }) => (
              <div
                key={title}
                className="group rounded-[28px] border border-[#d9d0c3] bg-white p-7 shadow-[0_14px_32px_rgba(18,43,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(18,43,30,0.08)]"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5ef] text-2xl shadow-inner shadow-white/80">
                  {icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                <p className="text-sm leading-7 text-[#677870]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f6f1] px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Visual Impact</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              See the Forest. Protect the Forest.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {IMAGE_GALLERY.map(({ src, title, className }) => (
              <div
                key={title}
                className={`group relative overflow-hidden rounded-[26px] border border-[#d8d2c7] bg-white shadow-[0_18px_30px_rgba(18,43,30,0.06)] ${className || ""}`}
                style={{ minHeight: className?.includes("md:col-span-2") ? "250px" : "220px" }}
              >
                <img
                  src={src}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2519]/75 via-[#0f2519]/10 to-transparent opacity-90" />
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">How It Works</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              A practical process for forest protection.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {PROCESS_STEPS.map(({ number, title, description }, index) => (
              <div key={title} className="relative">
                <div className="rounded-[28px] border border-[#d7d0c7] bg-white p-6 shadow-[0_18px_30px_rgba(18,43,30,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(18,43,30,0.09)]">
                  <div className="mb-5 inline-flex rounded-full bg-[#edf5ef] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1e4d35]">{number}</div>
                  <h3 className="mb-3 text-xl font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                  <p className="text-sm leading-7 text-[#677870]">{description}</p>
                </div>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 h-px w-8 -translate-y-1/2 bg-[#bfd8c3]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#edf5ef] px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Our Technology</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Built for intelligent environmental response.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TECHNOLOGY.map(({ icon, title, description }) => (
              <div key={title} className="rounded-[24px] border border-[#d8d2c7] bg-white p-6 shadow-[0_16px_28px_rgba(18,43,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(18,43,30,0.08)]">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5ef] text-2xl">{icon}</div>
                <h3 className="mb-3 text-lg font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                <p className="text-sm leading-7 text-[#677870]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Real-World Impact</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Practical outcomes for better environmental awareness.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {IMPACT.map(({ title, description }) => (
              <div key={title} className="rounded-[26px] border border-[#d8d2c7] bg-white p-6 shadow-[0_16px_28px_rgba(18,43,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(18,43,30,0.08)]">
                <div className="mb-4 inline-flex rounded-full border border-[#bfd8c3] bg-[#edf5ef] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1e4d35]">Impact</div>
                <h3 className="mb-3 text-lg font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                <p className="text-sm leading-7 text-[#677870]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell max-w-[1200px]">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Our Approach</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Detect → Verify → Report → Protect
            </h2>
          </div>

          <div className="space-y-5">
            {APPROACH.map(({ step, description }, index) => (
              <div key={step} className="flex items-center gap-4 rounded-[24px] border border-[#d8d2c7] bg-white p-5 shadow-[0_16px_28px_rgba(18,43,30,0.04)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e4d35] text-sm font-bold text-[#f5f3ee]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-lg font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step}</div>
                  <p className="text-sm leading-7 text-[#677870]">{description}</p>
                </div>
                {index < APPROACH.length - 1 && (
                  <div className="hidden text-2xl text-[#86b294] sm:block">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f6f1] px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Forest Stories</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              The people, places, and ecosystems behind the work.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {STORY_CARDS.map(({ title, description, image }) => (
              <article key={title} className="overflow-hidden rounded-[28px] border border-[#d8d2c7] bg-white shadow-[0_18px_30px_rgba(18,43,30,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(18,43,30,0.09)]">
                <img src={image} alt={title} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-[#1a2820]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                  <p className="text-sm leading-7 text-[#677870]">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="content-shell max-w-[1200px] rounded-[32px] border border-[#d8d2c7] bg-white p-8 text-center shadow-[0_22px_40px_rgba(18,43,30,0.05)] sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3d7a52]">Take Action</p>
          <h2 className="mt-4 text-3xl font-black text-[#1a2820] sm:text-4xl" style={{ letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Be Part of the Effort to Protect Our Forests
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#677870]">
            Help identify, verify, and report environmental threats before they lead to lasting damage.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate("detect")}
              className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-bold text-[#f5f3ee] shadow-[0_16px_30px_rgba(30,77,53,0.2)] transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: "#1e4d35" }}
            >
              Start Detection →
            </button>
            <button
              onClick={() => navigate("reports")}
              className="inline-flex items-center justify-center rounded-xl border border-[#d8d2c7] bg-[#f5f3ee] px-7 py-3.5 text-sm font-bold text-[#1e4d35] transition-all duration-200 hover:-translate-y-0.5"
            >
              View Reports
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
