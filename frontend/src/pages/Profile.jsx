import { useContext, useRef, useState } from "react";
import { useRouter, AuthContext } from "../App";

export default function Profile() {
  const { navigate } = useRouter();
  const auth = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const user = auth.user || { name: "", email: "" };
  const safeName = user.name?.trim() || "User";
  const safeEmail = user.email?.trim() || "No email added";

  const handlePhotoChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="px-4 pb-20 pt-20 sm:px-6 lg:px-8">
      <div className="content-shell mx-auto w-full max-w-[1320px]">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#677870" }}>Account</p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-[2.1rem]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Profile</h1>
          </div>
          <button
            onClick={() => navigate("home")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-95"
            style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}
          >
            Home
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div
            className="rounded-[28px] border p-6 shadow-[0_18px_40px_rgba(20,56,33,0.06)] sm:p-7"
            style={{ backgroundColor: "#ffffff", borderColor: "#d9d1c6" }}
          >
            <div className="mb-5 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#d7e6d9] text-2xl font-bold shadow-inner transition-transform duration-200 hover:scale-[1.02]"
                style={{ backgroundColor: profilePhoto ? "#f5f3ee" : "#e7f1ea", color: "#1e4d35" }}
                aria-label="Upload profile photo"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}

                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#1a2820]/55 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Add
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="mb-5 text-center sm:text-left">
              <h2 className="text-[1.8rem] font-bold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>{safeName}</h2>
              <p className="mt-2 text-sm" style={{ color: "#677870" }}>{safeEmail}</p>
            </div>

            <div className="space-y-3 text-sm" style={{ color: "#677870" }}>
              <div className="flex items-center justify-between gap-4 border-b py-2.5" style={{ borderColor: "#e8e3da" }}>
                <span className="font-medium">Name</span>
                <span className="font-semibold" style={{ color: "#1a2820" }}>{safeName}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5" style={{ borderColor: "#e8e3da" }}>
                <span className="font-medium">Email</span>
                <span className="text-right font-semibold" style={{ color: "#1a2820" }}>{safeEmail}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-[28px] border p-6 shadow-[0_18px_40px_rgba(20,56,33,0.06)] sm:p-7"
            style={{ backgroundColor: "#ffffff", borderColor: "#d9d1c6" }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2820" }}>Account Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ["Name", safeName],
                ["Email", safeEmail],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border p-4" style={{ backgroundColor: "#f7f5f1", borderColor: "#e6e0d7" }}>
                  <p className="mb-2 text-[0.67rem] font-semibold uppercase tracking-[0.14em]" style={{ color: "#677870" }}>{label}</p>
                  <p className="text-sm font-medium leading-6" style={{ color: "#1a2820" }}>{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("reports")}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-95"
                style={{ backgroundColor: "#1e4d35", color: "#f5f3ee" }}
              >
                View Reports
              </button>
              <button
                onClick={() => navigate("detect")}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-95"
                style={{ backgroundColor: "#e3ede8", color: "#1e4d35" }}
              >
                New Detection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
