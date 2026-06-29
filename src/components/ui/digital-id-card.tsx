"use client";

import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";

interface DigitalIdCardProps {
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    phone?: string | null;
    role: string;
    college?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    createdAt: Date | string;
    studentalumniUserId?: string | null;
  };
}

function formatUserId(userId: string, index?: number): string {
  if (index) return `SA-2024-${String(index).padStart(6, "0")}`;
  const short = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `SA-2024-${short}`;
}

function getInitials(first?: string | null, last?: string | null): string {
  return [first, last]
    .filter(Boolean)
    .map((n) => n!.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2) || "?";
}

export default function DigitalIdCard({ user }: DigitalIdCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const initials = getInitials(user.firstName, user.lastName);
  const displayId = formatUserId(user.id);
  const issuedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const expiresDate = new Date(
    new Date(user.createdAt).getFullYear() + 1,
    new Date(user.createdAt).getMonth(),
    new Date(user.createdAt).getDate()
  ).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://events.forgetechno.com";
  const profileUrl = `${appUrl}/id/${user.id}`;

  useEffect(() => {
    QRCode.toDataURL(profileUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#1f1107", light: "#ffffff00" },
    }).then(setQrDataUrl).catch(() => {});
  }, [profileUrl]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(displayId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [displayId]);

  const handleShare = useCallback(() => {
    const text = `Check out my profile: ${profileUrl}`;
    if (navigator.share) {
      navigator.share({ title: "My Profile", text, url: profileUrl });
    } else {
      navigator.clipboard.writeText(profileUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [profileUrl]);

  const roleDisplay = user.role === "SUPER_ADMIN"
    ? "Super Admin"
    : user.role === "ADMIN"
    ? "Admin"
    : user.role === "SCANNER"
    ? "Scanner"
    : user.role === "ORGANIZATION_ADMIN"
    ? "Org Admin"
    : "Member";

  const subtitle = [user.jobTitle, user.company].filter(Boolean).join(" · ")
    || user.college
    || "Platform Member";

  return (
    <div className="w-full max-w-[540px] mx-auto" style={{ perspective: "1000px" }}>
      <div
        id="digital-id-card"
        className="relative w-full cursor-pointer"
        style={{ height: "440px", transformStyle: "preserve-3d", transition: "transform 0.6s", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* ─── FRONT ─── */}
        <div
          className="absolute inset-0 rounded-[22px] overflow-hidden"
          style={{ backfaceVisibility: "hidden", background: "linear-gradient(120deg, #fbbf24, #f97316, #b45309)" }}
        >
          {/* Watermark */}
          <div className="absolute -top-[10px] -right-[10px] opacity-[0.08] select-none pointer-events-none">
            <span className="text-[140px] font-black tracking-[-6px]" style={{ color: "#1f1107", fontFamily: "ui-monospace, monospace" }}>SA</span>
          </div>

          {/* Glass card */}
          <div className="flex flex-col h-full p-5 m-[1px] rounded-[21px]" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(6px)" }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[1.2px]" style={{ color: "rgba(31,17,7,0.7)" }}>STUDENT ALUMNI</div>
                <div className="text-[22px] font-bold leading-tight" style={{ color: "#1f1107" }}>OFFICIAL ID</div>
              </div>
              <div className="rounded-[8px] px-[10px] py-[5px]" style={{ backgroundColor: "rgba(31,17,7,0.13)", border: "1px solid rgba(31,17,7,0.18)" }}>
                <span className="text-[10px] font-bold tracking-[0.5px]" style={{ color: "rgba(31,17,7,0.65)" }}>{roleDisplay.toUpperCase()}</span>
              </div>
            </div>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mt-[22px]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 overflow-hidden shrink-0" style={{ backgroundColor: "rgba(31,17,7,0.15)", borderColor: "rgba(255,255,255,0.4)", color: "rgba(31,17,7,0.6)" }}>
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-bold truncate" style={{ color: "#1f1107" }}>{name}</div>
                <div className="text-[12px] truncate" style={{ color: "rgba(31,17,7,0.65)" }}>{subtitle}</div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-[22px] space-y-[10px]">
              <div>
                <div className="text-[9px] font-bold tracking-[0.8px]" style={{ color: "rgba(31,17,7,0.45)" }}>MEMBER ID</div>
                <div className="text-[15px] font-bold" style={{ color: "#1f1107" }}>{displayId}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-[0.8px]" style={{ color: "rgba(31,17,7,0.45)" }}>EMAIL</div>
                <div className="text-[13px] font-extrabold truncate" style={{ color: "rgba(31,17,7,0.8)" }}>{user.email}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-[0.8px]" style={{ color: "rgba(31,17,7,0.45)" }}>ISSUED</div>
                <div className="text-[12px] font-bold" style={{ color: "rgba(31,17,7,0.75)" }}>{issuedDate}</div>
              </div>
            </div>

            <div className="flex-1" />
            <div className="flex items-center justify-end">
              <span className="text-[11px] font-semibold" style={{ color: "rgba(31,17,7,0.5)" }}>Tap for verification →</span>
            </div>
          </div>
        </div>

        {/* ─── BACK ─── */}
        <div
          className="absolute inset-0 rounded-[22px] overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(120deg, #fbbf24, #f97316, #b45309)" }}
        >
          {/* Watermark */}
          <div className="absolute -top-[10px] -right-[10px] opacity-[0.08] select-none pointer-events-none">
            <span className="text-[140px] font-black tracking-[-6px]" style={{ color: "#1f1107", fontFamily: "ui-monospace, monospace" }}>SA</span>
          </div>

          {/* Glass card */}
          <div className="flex flex-col h-full p-5 m-[1px] rounded-[21px]" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(6px)" }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[1.2px]" style={{ color: "rgba(31,17,7,0.7)" }}>STUDENT ALUMNI</div>
                <div className="text-[22px] font-bold leading-tight" style={{ color: "#1f1107" }}>VERIFIED CREDENTIAL</div>
              </div>
              <div className="rounded-[8px] px-[10px] py-[5px]" style={{ backgroundColor: "rgba(22,163,74,0.25)", border: "1px solid rgba(22,163,74,0.4)" }}>
                <span className="text-[10px] font-bold tracking-[0.5px]" style={{ color: "rgb(22,101,52)" }}>VERIFIED</span>
              </div>
            </div>

            {/* Back details + QR */}
            <div className="mt-[18px] flex justify-between items-start">
              <div className="space-y-[12px]">
                <div>
                  <div className="text-[9px] font-bold tracking-[0.8px]" style={{ color: "rgba(31,17,7,0.45)" }}>EMAIL</div>
                  <div className="text-[14px] font-bold truncate max-w-[180px]" style={{ color: "#1f1107" }}>{user.email}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.8px]" style={{ color: "rgba(31,17,7,0.45)" }}>ROLE</div>
                  <div className="text-[14px] font-bold" style={{ color: "#1f1107" }}>{roleDisplay}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.8px]" style={{ color: "rgba(31,17,7,0.45)" }}>ACCESS</div>
                  <div className="text-[14px] font-bold" style={{ color: "#1f1107" }}>
                    {user.role === "SUPER_ADMIN" ? "Full Access" : user.role === "ADMIN" ? "Full Access" : user.role === "SCANNER" ? "Scanner Access" : "Standard Access"}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.8px]" style={{ color: "rgba(31,17,7,0.45)" }}>EXPIRES</div>
                  <div className="text-[12px] font-bold" style={{ color: "rgba(31,17,7,0.75)" }}>{expiresDate}</div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[100px] h-[100px] rounded-[12px] flex items-center justify-center overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
                  {qrDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                  )}
                </div>
                <div className="w-8 h-6 rounded flex items-center justify-center" style={{ backgroundColor: "rgba(31,17,7,0.15)", border: "1px solid rgba(31,17,7,0.2)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(31,17,7,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M18 14h-2a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1" />
            <div className="flex items-center justify-end">
              <span className="text-[11px] font-semibold" style={{ color: "rgba(31,17,7,0.5)" }}>Tap to flip back →</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Action buttons ─── */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-[10px] px-[14px] py-[8px] text-white text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1f1107" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="14" height="14" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          {copied ? "Copied!" : "Copy ID"}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-[10px] px-[14px] py-[8px] text-white text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1f1107" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share Profile
        </button>
      </div>

      {/* ─── Feature badges ─── */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="rounded-[14px] p-3" style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-[12px] font-semibold" style={{ color: "#1f1107" }}>Verified Identity</span>
          </div>
          <p className="text-[11px]" style={{ color: "rgba(31,17,7,0.55)" }}>Your identity is verified by the platform.</p>
        </div>
        <div className="rounded-[14px] p-3" style={{ backgroundColor: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12h4" />
              <path d="M10 8h4" />
              <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
              <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
              <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
            </svg>
            <span className="text-[12px] font-semibold" style={{ color: "#1f1107" }}>Platform Member</span>
          </div>
          <p className="text-[11px]" style={{ color: "rgba(31,17,7,0.55)" }}>Recognised across the platform.</p>
        </div>
        <div className="rounded-[14px] p-3" style={{ backgroundColor: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.18)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="5" height="5" rx="1" />
              <rect x="16" y="3" width="5" height="5" rx="1" />
              <rect x="3" y="16" width="5" height="5" rx="1" />
              <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
              <path d="M21 21v.01" />
              <path d="M12 7v3a2 2 0 0 1-2 2H7" />
              <path d="M3 12h.01" />
              <path d="M12 3h.01" />
              <path d="M12 16v.01" />
              <path d="M16 12h1" />
              <path d="M21 12v.01" />
              <path d="M12 21v-1" />
            </svg>
            <span className="text-[12px] font-semibold" style={{ color: "#1f1107" }}>Instant Share</span>
          </div>
          <p className="text-[11px]" style={{ color: "rgba(31,17,7,0.55)" }}>Share your QR at events.</p>
        </div>
        <div className="rounded-[14px] p-3" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[12px] font-semibold" style={{ color: "#1f1107" }}>Secure Access</span>
          </div>
          <p className="text-[11px]" style={{ color: "rgba(31,17,7,0.55)" }}>Verified and tamper-proof.</p>
        </div>
      </div>
    </div>
  );
}
