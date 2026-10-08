import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("This password reset link is invalid or expired.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token || !email) {
      setError("This password reset link is invalid or expired.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const json = await res.json().catch(() => ({}));
      setLoading(false);

      if (!res.ok) {
        setError(json.detail || "Unable to reset password.");
        return;
      }

      setMessage("Your password has been reset successfully.");
      setTimeout(() => navigate("login"), 1500);
    } catch (err) {
      setLoading(false);
      setError("Unable to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: "#f5f3ee" }}>
      <div className="w-full max-w-md rounded-[28px] border p-6 shadow-[0_18px_40px_rgba(30,77,53,0.08)]" style={{ backgroundColor: "#ffffff", borderColor: "rgba(105,124,112,0.16)" }}>
        <div className="mb-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-2" style={{ backgroundColor: "#e9f0eb", border: "1px solid #d4e1d8" }}>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}>🛡️</span>
            <span className="text-base font-bold" style={{ color: "#1e4d35", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GreenGuard</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Set a new password</h1>
        <p className="mt-2 text-center text-sm" style={{ color: "#677870" }}>Choose a strong password to secure your account.</p>

        {error && (
          <div className="mt-4 rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: "#fff1f2", color: "#7a1f2a", border: "1px solid #f5c2c7" }}>
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-xl px-3 py-2 text-sm text-center" style={{ backgroundColor: "#e6f5ea", color: "#1e4d35", border: "1px solid #cfe8d5" }}>
            {message}
          </div>
        )}

        {!error && !message && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#677870" }}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#1e4d35]"
                style={{ borderColor: "#d2ccc0", backgroundColor: "#ffffff", color: "#1a2820" }}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#677870" }}>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#1e4d35]"
                style={{ borderColor: "#d2ccc0", backgroundColor: "#ffffff", color: "#1a2820" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-bold transition hover:opacity-95 disabled:opacity-70"
              style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
