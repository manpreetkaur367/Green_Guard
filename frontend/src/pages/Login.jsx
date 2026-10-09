import { useState, useContext } from "react";
import { useRouter, AuthContext } from "../App";
import { buildApiUrl } from "../services/api";

export default function Login({ mode = "login" }) {
  const { navigate } = useRouter();
  const auth = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (isForgot) {
      if (!form.email.trim()) {
        setErrors({ email: "Please enter your email address." });
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(buildApiUrl("/auth/forgot-password"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });

        const json = await res.json().catch(() => ({}));
        setLoading(false);

        if (!res.ok) {
          setErrors({ general: json.detail || "Unable to send reset link." });
          return;
        }

        if (json.resetUrl) {
          setSuccessMessage("Reset link created successfully.");
          setTimeout(() => {
            window.open(json.resetUrl, "_blank", "noopener,noreferrer");
          }, 200);
        } else {
          setSuccessMessage("If an account exists, a reset link has been sent.");
        }

        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setLoading(false);
        setErrors({ general: "Unable to send reset link. Please try again." });
      }
      return;
    }

    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
    if (!emailValid) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    if (!form.password) {
      setErrors({ password: "Please enter your password." });
      return;
    }

    if (isRegister) {
      if (!form.name.trim()) {
        setErrors({ general: "Please enter your name." });
        return;
      }
      if (form.password.length < 8) {
        setErrors({ password: "Password must be at least 8 characters." });
        return;
      }
      if (form.password !== form.confirm) {
        setErrors({ general: "Passwords do not match." });
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch(buildApiUrl("/auth/register"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        });

        setLoading(false);

        if (res.ok) {
          setSuccessMessage("Account created successfully. Please sign in.");
          window.location.assign("/login");
          return;
        }

        const json = await res.json().catch(() => ({}));
        setErrors({ general: json.detail || "Registration failed. Please try again." });
        return;
      }

      const res = await fetch(buildApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        const user = json.user || { name: "", email: form.email };
        const token = json.token;
        auth.login(user, token, remember);
        setLoading(false);
        setSuccessMessage("You're signed in. Welcome back to GreenGuard.");
        window.location.assign("/");
        return;
      }

      const json = await res.json().catch(() => ({}));
      setErrors({ general: json.detail || "Invalid email or password." });
    } catch (err) {
      setErrors({ general: "Login failed. Check server or network." });
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: "Welcome back",
    register: "Create your account",
    forgot: "Reset your password",
  };

  const subtitles = {
    login: "Sign in to continue monitoring forests.",
    register: "Join GreenGuard and start protecting forests.",
    forgot: "Enter your email to receive a reset link.",
  };

  const TreeIllustration = () => (
    <div className="relative h-[360px] w-full max-w-[420px]">
      <div className="absolute inset-x-0 bottom-0 h-28 rounded-t-[120px] bg-gradient-to-t from-[#102e1d] to-[#1b4737]/80 shadow-[inset_0_20px_40px_rgba(255,255,255,0.08)]" />
      <div className="absolute bottom-10 left-6 h-24 w-24 rounded-full bg-[#dff1db]/20 blur-2xl" />
      <div className="absolute bottom-10 right-8 h-32 w-32 rounded-full bg-[#c9f0c9]/15 blur-2xl" />

      <div className="absolute bottom-14 left-8 h-20 w-5 rounded-full bg-[#5b3d2d] shadow-[0_0_14px_rgba(0,0,0,0.18)]" />
      <div className="absolute bottom-28 left-4 h-20 w-20 rounded-full bg-[#88c198] shadow-[0_0_30px_rgba(136,193,152,0.7)]" />
      <div className="absolute bottom-28 left-10 h-24 w-24 rounded-full bg-[#6fb88d]" />
      <div className="absolute bottom-28 left-20 h-16 w-16 rounded-full bg-[#9bd9a3]" />

      <div className="absolute bottom-16 left-32 h-24 w-6 rounded-full bg-[#5b3d2d] shadow-[0_0_14px_rgba(0,0,0,0.18)]" />
      <div className="absolute bottom-36 left-26 h-24 w-24 rounded-full bg-[#8dcf9e]" />
      <div className="absolute bottom-36 left-38 h-20 w-20 rounded-full bg-[#76bb8a]" />
      <div className="absolute bottom-36 left-48 h-16 w-16 rounded-full bg-[#a8e3b0]" />

      <div className="absolute bottom-20 right-20 h-28 w-7 rounded-full bg-[#543d2f] shadow-[0_0_14px_rgba(0,0,0,0.18)]" />
      <div className="absolute bottom-42 right-12 h-24 w-24 rounded-full bg-[#8dcf9e]" />
      <div className="absolute bottom-46 right-28 h-20 w-20 rounded-full bg-[#76bb8a]" />
      <div className="absolute bottom-42 right-36 h-18 w-18 rounded-full bg-[#a8e3b0]" />

      <div className="absolute left-10 top-10 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ecf8ef] backdrop-blur-sm">
        Forest Watch
      </div>

      <div className="absolute right-10 top-16 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md shadow-[0_12px_20px_rgba(7,30,18,0.12)]">
        <div className="flex items-center gap-2 text-[#ebf7ef]">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#8ee1a1]" />
          <span className="text-xs font-medium">Live monitoring</span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-2xl font-bold text-white">96%</span>
          <span className="mb-1 text-[10px] text-[#dbf4df]">coverage</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[#f5f3ee] px-4 py-8 sm:px-6 lg:px-10 flex items-center justify-center" style={{ backgroundColor: "#f5f3ee" }}>
      <div className="mx-auto flex max-w-6xl animate-fade-in-up overflow-hidden rounded-[32px] border border-[#d8e2d5] bg-white shadow-[0_30px_80px_rgba(20,56,33,0.16)]">
        <div className="relative hidden w-[46%] overflow-hidden bg-gradient-to-br from-[#173f2e] via-[#1e4d35] to-[#d8eadb] p-8 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(158,213,162,0.35),_transparent_30%)]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl shadow-inner shadow-white/20 backdrop-blur-sm">🌿</div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#dfeee3]">GreenGuard</div>
              <div className="text-lg font-semibold text-white">Forest protection</div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ebf7ef] backdrop-blur-sm">
              Smart monitoring
            </div>
            <h2 className="max-w-sm text-4xl font-black leading-tight text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Protect forests with real-time intelligence.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#e6f3e8]">
              Monitor ecosystem health, detect risk patterns, and respond faster to protect biodiversity.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#dcefe1]">Alerts</div>
                <div className="mt-2 text-2xl font-bold text-white">18</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#dcefe1]">Zones</div>
                <div className="mt-2 text-2xl font-bold text-white">42</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#dcefe1]">Saved</div>
                <div className="mt-2 text-2xl font-bold text-white">94%</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-6 flex justify-center animate-float">
            <TreeIllustration />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[#f8f7f4] p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe8df] bg-[#edf5ef] px-3 py-2 shadow-[0_8px_20px_rgba(30,77,53,0.06)]" style={{ backgroundColor: "#e9f0eb" }}>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm shadow-inner shadow-white/70" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}>🌱</span>
                <span className="text-base font-bold" style={{ color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GreenGuard</span>
              </div>
            </div>

            <div className="rounded-[28px] border bg-white p-5 shadow-[0_20px_45px_rgba(30,77,53,0.08)] sm:p-7" style={{ borderColor: "rgba(105,124,112,0.16)" }}>
              <h1 className="text-center text-3xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>{titles[mode]}</h1>
              <p className="mt-2 text-center text-sm" style={{ color: "#677870" }}>{subtitles[mode]}</p>

              {successMessage && (
                <div className="mt-4 rounded-xl px-3 py-2 text-sm font-medium text-center" style={{ backgroundColor: "#e6f5ea", color: "#1e4d35", border: "1px solid #cfe8d5" }}>
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {errors.general && (
                  <div className="rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: "#fff1f2", color: "#7a1f2a", border: "1px solid #f5c2c7" }}>
                    {errors.general}
                  </div>
                )}

                {isRegister && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#677870" }}>Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#1e4d35]"
                      style={{ borderColor: "#d2ccc0", backgroundColor: "#ffffff", color: "#1a2820" }}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#677870" }}>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#1e4d35] focus:ring-4 focus:ring-[#dceee3]"
                    style={{ borderColor: errors.email ? "#ef4444" : "#d2ccc0", backgroundColor: "#ffffff", color: "#1a2820" }}
                  />
                  {errors.email && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.email}</p>}
                </div>

                {!isForgot && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#677870" }}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border px-3 py-2.5 pr-12 text-sm outline-none transition focus:border-[#1e4d35] focus:ring-4 focus:ring-[#dceee3]"
                        style={{ borderColor: errors.password ? "#ef4444" : "#d2ccc0", backgroundColor: "#ffffff", color: "#1a2820" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                        style={{ color: "#677870" }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.password}</p>}
                  </div>
                )}

                {isRegister && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#677870" }}>Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.confirm}
                      onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#1e4d35]"
                      style={{ borderColor: "#d2ccc0", backgroundColor: "#ffffff", color: "#1a2820" }}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between text-xs" style={{ color: "#677870" }}>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => navigate("forgot-password")} className="font-semibold" style={{ color: "#1e4d35" }}>
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-bold shadow-[0_14px_26px_rgba(30,77,53,0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(30,77,53,0.22)] disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #1f533c 0%, #173f2e 100%)", color: "#f5f3ee" }}
                >
                  {loading ? (isForgot ? "Sending..." : isRegister ? "Creating account..." : "Signing in...") : isForgot ? "Send Reset Link" : isRegister ? "Create Account" : "Sign In"}
                </button>

                <div className="pt-1 text-center text-sm" style={{ color: "#677870" }}>
                  {isLogin ? "Need an account? " : isRegister ? "Already have an account? " : "Remember your password? "}
                  <button
                    type="button"
                    onClick={() => navigate(isLogin ? "register" : "login")}
                    className="font-semibold"
                    style={{ color: "#1e4d35" }}
                  >
                    {isLogin ? "Sign up" : isRegister ? "Sign in" : "Back to sign in"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
