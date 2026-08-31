import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step =
  | "landing"
  | "registration"
  | "loading"
  | "vehicle"
  | "details"
  | "plans"
  | "addons"
  | "review"
  | "payment"
  | "processing"
  | "failed"
  | "success";

interface Plan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  description: string;
  highlights: string[];
  deductible: string;
  coverage: Record<string, boolean>;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  detail: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COVERAGE_ITEMS = [
  "Accident damage",
  "Theft protection",
  "Third-party liability",
  "Natural disasters",
  "Personal accident cover",
  "Roadside assistance",
];

const PLANS: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 12450,
    description: "Essential protection for everyday driving.",
    highlights: [
      "Accident damage",
      "Theft protection",
      "Third-party liability",
      "Personal accident cover",
    ],
    deductible: "₹5,000",
    coverage: {
      "Accident damage": true,
      "Theft protection": true,
      "Third-party liability": true,
      "Natural disasters": false,
      "Personal accident cover": true,
      "Roadside assistance": false,
    },
  },
  {
    id: "recommended",
    name: "Recommended",
    badge: "Most Popular",
    price: 16850,
    description: "Balanced protection with broader cover.",
    highlights: [
      "Accident damage",
      "Theft protection",
      "Third-party liability",
      "Natural disasters",
      "Personal accident cover",
      "Roadside assistance",
    ],
    deductible: "₹3,000",
    coverage: {
      "Accident damage": true,
      "Theft protection": true,
      "Third-party liability": true,
      "Natural disasters": true,
      "Personal accident cover": true,
      "Roadside assistance": true,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 21950,
    description: "Maximum protection for greater peace of mind.",
    highlights: [
      "Accident damage",
      "Theft protection",
      "Third-party liability",
      "Natural disasters",
      "Personal accident cover",
      "Roadside assistance",
    ],
    deductible: "₹1,000",
    coverage: {
      "Accident damage": true,
      "Theft protection": true,
      "Third-party liability": true,
      "Natural disasters": true,
      "Personal accident cover": true,
      "Roadside assistance": true,
    },
  },
];

const ADDONS: AddOn[] = [
  {
    id: "zero-dep",
    name: "Zero Depreciation",
    description:
      "Reduce depreciation deductions on eligible parts when making a claim.",
    price: 1200,
    detail:
      "Without this, your claim payout is reduced by the depreciated value of replaced parts. This add-on ensures you receive the full replacement cost.",
  },
  {
    id: "roadside",
    name: "Roadside Assistance",
    description: "24/7 breakdown support — towing, fuel delivery, emergency repairs.",
    price: 750,
    detail:
      "If your car breaks down anywhere in India, our network dispatches help within 60 minutes at no extra cost.",
  },
  {
    id: "engine",
    name: "Engine Protection",
    description:
      "Covers repair costs for engine damage due to water ingression or oil leakage.",
    price: 1500,
    detail:
      "Standard policies exclude engine damage from monsoon flooding. This add-on fills that critical gap.",
  },
  {
    id: "key",
    name: "Key Replacement",
    description:
      "Covers the cost of replacing lost, stolen, or damaged car keys.",
    price: 450,
    detail:
      "Modern car keys can cost ₹8,000–₹20,000 to replace. This add-on covers that cost fully.",
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

interface RegError {
  title: string;
  hint: string;
}

const REG_STANDARD_FORMAT = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
const REG_BH_FORMAT = /^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/;
const REG_EXAMPLE_HINT = "Use the format on your RC book, e.g. TN 38 AB 1234.";

function validateRegNumber(raw: string): RegError | null {
  const core = raw.trim().toUpperCase().replace(/\s+/g, "");

  if (/[^A-Z0-9]/.test(core)) {
    return {
      title: "Only letters and numbers are allowed, no symbols.",
      hint: REG_EXAMPLE_HINT,
    };
  }
  if (core.length < 9 || core.length > 10) {
    return {
      title: "Registration number must be 9-10 characters long.",
      hint: REG_EXAMPLE_HINT,
    };
  }
  if (!/[A-Z]/.test(core) || !/[0-9]/.test(core)) {
    return {
      title: "Registration number must be a mix of letters and numbers.",
      hint: REG_EXAMPLE_HINT,
    };
  }
  if (!REG_STANDARD_FORMAT.test(core) && !REG_BH_FORMAT.test(core)) {
    return {
      title: "That doesn't look like a valid registration number.",
      hint: REG_EXAMPLE_HINT,
    };
  }
  return null;
}

const STAGE_LABELS = ["Vehicle", "Details", "Cover", "Review", "Payment"];

function getStage(step: Step): number {
  if (["registration", "loading", "vehicle"].includes(step)) return 0;
  if (step === "details") return 1;
  if (["plans", "addons"].includes(step)) return 2;
  if (step === "review") return 3;
  if (["payment", "processing", "failed"].includes(step)) return 4;
  return -1;
}

// ─── Shared Components ────────────────────────────────────────────────────────

function Header({
  showHelp,
  onLogoClick,
}: {
  showHelp?: boolean;
  onLogoClick: () => void;
}) {
  return (
    <header
      style={{ borderBottom: "1px solid #E2E8F0" }}
      className="bg-white sticky top-0 z-40"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#1D4ED8" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2L2.5 6v5.5c0 3.5 2.8 6.7 6.5 7.5 3.7-.8 6.5-4 6.5-7.5V6L9 2z"
                fill="white"
              />
            </svg>
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{ color: "#0F172A" }}
          >
            InsureGo
          </span>
        </button>
        {showHelp && (
          <div className="flex items-center gap-3 text-sm" style={{ color: "#64748B" }}>
            <span>Need help?</span>
            <a
              href="tel:18001234567"
              className="font-semibold"
              style={{ color: "#1D4ED8" }}
            >
              1800 123 4567
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function ProgressBar({ step }: { step: Step }) {
  const active = getStage(step);
  if (active < 0) return null;
  return (
    <div className="bg-white" style={{ borderBottom: "1px solid #E2E8F0" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center max-w-[480px] mx-auto">
          {STAGE_LABELS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                  style={{
                    background:
                      i <= active ? "#1D4ED8" : "#F1F5F9",
                    color: i <= active ? "white" : "#94A3B8",
                    boxShadow: i === active ? "0 0 0 4px #DBEAFE" : "none",
                  }}
                >
                  {i < active ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6l3 3 4-4.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: i <= active ? "#1E293B" : "#94A3B8" }}
                >
                  {label}
                </span>
              </div>
              {i < STAGE_LABELS.length - 1 && (
                <div
                  className="h-px flex-1 mx-2 mb-5 transition-all"
                  style={{ background: i < active ? "#1D4ED8" : "#E2E8F0" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageWrap({
  children,
  wide,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto px-6 py-10 w-full ${wide ? "max-w-[1100px]" : "max-w-[680px]"}`}
    >
      {children}
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="back-btn flex items-center gap-1.5 text-sm font-medium mb-8"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 12L6 8l4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`btn-${variant} inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm ${className}`}
      style={{ padding: "10px 20px" }}
    >
      {children}
    </button>
  );
}

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="flex-shrink-0"
      >
        <circle cx="8" cy="8" r="7" fill="#DCFCE7" />
        <path
          d="M5 8l2 2 4-4"
          stroke="#16A34A"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0"
    >
      <circle cx="8" cy="8" r="7" fill="#F1F5F9" />
      <path
        d="M5.5 8h5"
        stroke="#CBD5E1"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
              style={{
                background: "#EFF6FF",
                color: "#1D4ED8",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L1 3.5V7c0 2.8 2.3 5 5 5s5-2.2 5-5V3.5L6 1z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              Car Insurance
            </div>
            <h1
              className="text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ color: "#0F172A" }}
            >
              Get the right cover
              <br />
              <span style={{ color: "#1D4ED8" }}>for your car</span>
            </h1>
            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: "#64748B" }}
            >
              Compare cover options, choose the protection you need, and get
              your policy online.
            </p>
            <Btn onClick={onStart} className="text-base px-8 py-3.5">
              Get a quote
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Btn>
            <p
              className="mt-4 text-sm flex items-center gap-2"
              style={{ color: "#94A3B8" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1L1.5 4v3.5c0 3 2.5 5.6 5.5 6.5 3-.9 5.5-3.5 5.5-6.5V4L7 1z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              Simple, secure and takes only a few minutes.
            </p>
            <div className="mt-10 flex gap-10">
              {[
                ["50,000+", "Policies issued"],
                ["4.8 / 5", "Customer rating"],
                ["24/7", "Support"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#0F172A" }}
                  >
                    {val}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/3", background: "#EFF6FF" }}
            >
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=700&h=525&fit=crop&auto=format"
                alt="Modern silver car on open road"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(15,23,42,0.4) 0%, transparent 60%)",
                }}
              />
              <div
                className="absolute bottom-5 left-5 right-5 rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.96)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "#64748B" }}
                    >
                      Average customer savings
                    </div>
                    <div
                      className="text-2xl font-bold mt-0.5"
                      style={{ color: "#0F172A" }}
                    >
                      ₹3,200/year
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "#DCFCE7" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M9 14V6M5 10l4-4 4 4"
                        stroke="#059669"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer
        className="bg-white"
        style={{ borderTop: "1px solid #E2E8F0" }}
      >
        <div
          className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between text-xs"
          style={{ color: "#94A3B8" }}
        >
          <span>© 2026 InsureGo. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Registration ─────────────────────────────────────────────────────────────

function RegistrationScreen({
  reg,
  setReg,
  onBack,
  onSubmit,
  error,
}: {
  reg: string;
  setReg: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  error: RegError | null;
}) {
  return (
    <PageWrap>
      <BackBtn onClick={onBack} />
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
        {"Let's find your car"}
      </h1>
      <p className="mb-8" style={{ color: "#64748B" }}>
        Enter your vehicle registration number and we'll retrieve your vehicle
        details.
      </p>

      <div className="space-y-5">
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "#374151" }}
          >
            Vehicle registration number
          </label>
          <input
            type="text"
            value={reg}
            onChange={(e) =>
              setReg(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9 ]/g, "")
                  .slice(0, 13)
              )
            }
            placeholder="TN 38 AB 1234"
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            className={`field-input w-full px-4 py-3 rounded-lg text-base font-medium tracking-wider${error ? " field-error" : ""}`}
          />
          {error ? (
            <div
              className="mt-2.5 flex items-start gap-2 text-sm"
              style={{ color: "#DC2626" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-0.5 flex-shrink-0"
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M8 5v3.5M8 10.5h.01"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <div className="font-semibold">{error.title}</div>
                <div className="mt-0.5" style={{ color: "#EF4444" }}>
                  {error.hint}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs" style={{ color: "#94A3B8" }}>
              Your registration number is printed on your RC book and number plate.
            </p>
          )}
        </div>

        <Btn
          onClick={onSubmit}
          disabled={!reg.trim()}
          className="w-full py-3.5 text-sm"
        >
          Find my vehicle
        </Btn>
      </div>
    </PageWrap>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <PageWrap>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
          Finding your vehicle details...
        </h1>
        <p className="mb-10" style={{ color: "#64748B" }}>
          This should only take a moment.
        </p>
        <div className="space-y-3">
          {[
            "Vehicle make & model",
            "Manufacturing year & variant",
            "Registration details",
            "Fuel type & transmission",
          ].map((label) => (
            <div
              key={label}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{ background: "white", border: "1px solid #E2E8F0" }}
            >
              <div
                className="w-10 h-10 rounded-lg animate-pulse"
                style={{ background: "#F1F5F9" }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-3 rounded animate-pulse"
                  style={{ background: "#F1F5F9", width: "45%" }}
                />
                <div
                  className="h-2.5 rounded animate-pulse"
                  style={{ background: "#F1F5F9", width: "65%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrap>
  );
}

// ─── Vehicle Details ──────────────────────────────────────────────────────────

function VehicleScreen({
  onConfirm,
  onWrong,
}: {
  onConfirm: () => void;
  onWrong: () => void;
}) {
  const fields: [string, string][] = [
    ["Make & model", "Hyundai Creta"],
    ["Variant", "SX(O)"],
    ["Manufacturing year", "2023"],
    ["Fuel type", "Petrol"],
    ["Transmission", "Automatic"],
    ["Registration date", "12 March 2023"],
  ];

  return (
    <PageWrap>
      <div
        className="flex items-center gap-2 text-sm rounded-lg px-4 py-3 mb-8"
        style={{
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#166534",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M5 8l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Your vehicle details were retrieved using your registration number.
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "#0F172A" }}>
        We found your vehicle
      </h1>
      <div className="text-2xl font-semibold mb-1" style={{ color: "#1D4ED8" }}>
        Hyundai Creta SX(O)
      </div>
      <p className="text-sm mb-7" style={{ color: "#64748B" }}>
        2023 · Petrol · Automatic
      </p>

      <div
        className="rounded-xl overflow-hidden mb-8"
        style={{ background: "white", border: "1px solid #E2E8F0" }}
      >
        {fields.map(([label, value], i) => (
          <div
            key={label}
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom: i < fields.length - 1 ? "1px solid #F1F5F9" : "none",
            }}
          >
            <span className="text-sm" style={{ color: "#64748B" }}>
              {label}
            </span>
            <span className="text-sm font-semibold" style={{ color: "#1E293B" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Btn onClick={onConfirm} className="flex-1 py-3.5 justify-center">
          Yes, these details are correct
        </Btn>
        <Btn variant="secondary" onClick={onWrong} className="flex-1 justify-center">
          {"Something's wrong?"}
        </Btn>
      </div>
    </PageWrap>
  );
}

// ─── Additional Details ───────────────────────────────────────────────────────

function DetailsScreen({
  carUse,
  setCarUse,
  hasInsurance,
  setHasInsurance,
  expiry,
  setExpiry,
  onBack,
  onContinue,
}: {
  carUse: string;
  setCarUse: (v: string) => void;
  hasInsurance: boolean | null;
  setHasInsurance: (v: boolean) => void;
  expiry: string;
  setExpiry: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const canContinue =
    carUse !== "" &&
    hasInsurance !== null &&
    (hasInsurance === false || expiry !== "");

  const useOptions = ["Personal", "Work", "Personal & work"];

  return (
    <PageWrap>
      <BackBtn onClick={onBack} />
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
        Tell us a little more about your car
      </h1>
      <p className="mb-8" style={{ color: "#64748B" }}>
        This helps us find the right cover options for you.
      </p>

      <div className="space-y-8">
        <div>
          <div className="text-sm font-semibold mb-3" style={{ color: "#374151" }}>
            How do you use your car?
          </div>
          <div className="grid grid-cols-3 gap-3">
            {useOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setCarUse(opt)}
                className={`option-btn px-4 py-3 rounded-lg text-sm font-medium text-left${carUse === opt ? " option-active" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold mb-3" style={{ color: "#374151" }}>
            Do you currently have car insurance?
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["Yes", "No"] as const).map((label) => {
              const val = label === "Yes";
              return (
                <button
                  key={label}
                  onClick={() => setHasInsurance(val)}
                  className={`option-btn px-4 py-3 rounded-lg text-sm font-medium${hasInsurance === val ? " option-active" : ""}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {hasInsurance === true && (
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#374151" }}
            >
              Current policy expiry date
            </label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="field-input w-full px-4 py-3 rounded-lg text-sm"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onBack}>
            Back
          </Btn>
          <Btn
            onClick={onContinue}
            disabled={!canContinue}
            className="flex-1 justify-center"
          >
            Continue
          </Btn>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── Plans ────────────────────────────────────────────────────────────────────

function PlansScreen({
  selected,
  onSelect,
  onCompare,
  onBack,
  onContinue,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onCompare: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <PageWrap wide>
      <BackBtn onClick={onBack} />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#0F172A" }}>
          Choose the cover that's right for you
        </h1>
        <p style={{ color: "#64748B" }}>
          Compare what's included and choose the protection that fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PLANS.map((plan) => {
          const isSel = selected === plan.id;
          const isRec = plan.id === "recommended";
          return (
            <div
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(plan.id)}
              className={`plan-card relative rounded-2xl${isSel ? " plan-selected" : ""}`}
              style={{
                background: "white",
                border: isSel
                  ? "2px solid #1D4ED8"
                  : isRec
                  ? "2px solid #BFDBFE"
                  : "2px solid #E2E8F0",
              }}
            >
              {isRec && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: "#D97706" }}
                >
                  Most Popular
                </div>
              )}
              <div className={`p-6 ${isRec ? "pt-8" : ""}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "#94A3B8" }}
                    >
                      {plan.name}
                    </div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: "#0F172A" }}
                    >
                      {fmt(plan.price)}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                      per year
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 transition-all"
                    style={{
                      border: isSel ? "2px solid #1D4ED8" : "2px solid #CBD5E1",
                      background: isSel ? "#1D4ED8" : "transparent",
                    }}
                  >
                    {isSel && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2.5 2.5 3.5-4"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "#64748B" }}
                >
                  {plan.description}
                </p>

                <div className="space-y-2.5 mb-6">
                  {COVERAGE_ITEMS.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckIcon included={plan.coverage[item]} />
                      <span
                        className="text-sm"
                        style={{
                          color: plan.coverage[item] ? "#334155" : "#CBD5E1",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-center justify-between text-xs pt-4"
                  style={{ borderTop: "1px solid #F1F5F9" }}
                >
                  <span style={{ color: "#94A3B8" }}>Deductible</span>
                  <span className="font-semibold" style={{ color: "#334155" }}>
                    {plan.deductible}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(plan.id);
                  }}
                  className="plan-select-btn w-full mt-5 py-2.5 rounded-lg text-sm font-semibold"
                  style={{
                    background: isSel ? "#1D4ED8" : "#F1F5F9",
                    color: isSel ? "white" : "#374151",
                  }}
                >
                  {isSel ? "Selected ✓" : "Select plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={onCompare}
          className="text-sm font-semibold flex items-center gap-1.5"
          style={{ color: "#1D4ED8" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 4h10M2 7h10M2 10h6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Compare all plans
        </button>
        <Btn onClick={onContinue} disabled={!selected}>
          Continue with{" "}
          {PLANS.find((p) => p.id === selected)?.name ?? "selected plan"}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Btn>
      </div>
    </PageWrap>
  );
}

// ─── Compare Plans Modal ──────────────────────────────────────────────────────

function ComparePlansModal({
  selected,
  onSelect,
  onClose,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const rows = [
    ...COVERAGE_ITEMS.map((item) => ({
      label: item,
      type: "check" as const,
      values: PLANS.map((p) => p.coverage[item]),
    })),
    {
      label: "Deductible",
      type: "text" as const,
      values: PLANS.map((p) => p.deductible),
    },
    {
      label: "Annual premium",
      type: "price" as const,
      values: PLANS.map((p) => fmt(p.price)),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.5)" }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[820px] max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
      >
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          <h2 className="text-xl font-bold" style={{ color: "#0F172A" }}>
            Compare your cover
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
            style={{ color: "#64748B" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead
              className="sticky top-0 bg-white"
              style={{ borderBottom: "1px solid #E2E8F0" }}
            >
              <tr>
                <th
                  className="text-left px-6 py-4 text-sm font-semibold"
                  style={{ color: "#64748B", width: "38%" }}
                >
                  Coverage
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    className="text-center px-4 py-4"
                    style={{
                      background:
                        plan.id === "recommended" ? "#EFF6FF" : "transparent",
                    }}
                  >
                    <div
                      className="text-sm font-bold"
                      style={{ color: "#0F172A" }}
                    >
                      {plan.name}
                    </div>
                    {plan.badge && (
                      <div
                        className="text-xs font-semibold mt-0.5"
                        style={{ color: "#D97706" }}
                      >
                        {plan.badge}
                      </div>
                    )}
                    <div
                      className="text-lg font-bold mt-1"
                      style={{ color: "#1D4ED8" }}
                    >
                      {fmt(plan.price)}
                    </div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>
                      / year
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  style={{ background: i % 2 === 0 ? "#FAFAFA" : "white" }}
                >
                  <td
                    className="px-6 py-3.5 text-sm"
                    style={{ color: "#374151" }}
                  >
                    {row.label}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className="text-center px-4 py-3.5"
                      style={{
                        background:
                          PLANS[j].id === "recommended"
                            ? "rgba(239,246,255,0.5)"
                            : "transparent",
                      }}
                    >
                      {row.type === "check" ? (
                        val ? (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                            style={{ background: "#DCFCE7" }}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M2.5 6l2.5 2.5 4-4"
                                stroke="#16A34A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span
                            className="text-xl font-light"
                            style={{ color: "#CBD5E1" }}
                          >
                            —
                          </span>
                        )
                      ) : (
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color:
                              row.type === "price" ? "#1D4ED8" : "#334155",
                          }}
                        >
                          {val as string}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="p-5 flex gap-3 justify-end flex-wrap"
          style={{ borderTop: "1px solid #E2E8F0" }}
        >
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => {
                onSelect(plan.id);
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: selected === plan.id ? "#1D4ED8" : "white",
                color: selected === plan.id ? "white" : "#374151",
                border:
                  selected === plan.id
                    ? "1.5px solid #1D4ED8"
                    : "1.5px solid #D1D5DB",
              }}
            >
              {selected === plan.id
                ? `${plan.name} selected ✓`
                : `Select ${plan.name}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Add-ons ──────────────────────────────────────────────────────────────────

function AddOnsScreen({
  selectedPlan,
  selectedAddons,
  onToggle,
  onBack,
  onContinue,
  onSkip,
}: {
  selectedPlan: string;
  selectedAddons: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const plan = PLANS.find((p) => p.id === selectedPlan)!;
  const addonsTotal = ADDONS.filter((a) =>
    selectedAddons.includes(a.id)
  ).reduce((s, a) => s + a.price, 0);

  return (
    <PageWrap>
      <BackBtn onClick={onBack} />
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
            Add extra protection
          </h1>
          <p style={{ color: "#64748B" }}>
            Choose optional protection based on what matters to you.
          </p>
        </div>
        <div
          className="hidden sm:block text-right text-sm"
          style={{ color: "#64748B" }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-0.5">
            Your plan
          </div>
          <div className="font-semibold" style={{ color: "#334155" }}>
            {plan.name}
          </div>
          <div className="font-bold" style={{ color: "#1D4ED8" }}>
            {fmt(plan.price)}/yr
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-8 mb-6">
        {ADDONS.map((addon) => {
          const isSel = selectedAddons.includes(addon.id);
          const isExp = expanded === addon.id;
          return (
            <div
              key={addon.id}
              className="rounded-xl transition-all"
              style={{
                background: "white",
                border: isSel ? "2px solid #1D4ED8" : "2px solid #E2E8F0",
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-base font-semibold"
                        style={{ color: "#1E293B" }}
                      >
                        {addon.name}
                      </span>
                      <button
                        onClick={() =>
                          setExpanded(isExp ? null : addon.id)
                        }
                        className="text-xs font-medium flex items-center gap-0.5 transition-colors"
                        style={{ color: "#1D4ED8" }}
                      >
                        Why need this?
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          style={{
                            transform: isExp
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <path
                            d="M3 4.5l3 3 3-3"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                      {addon.description}
                    </p>
                    {isExp && (
                      <p
                        className="text-sm leading-relaxed mt-3 px-3 py-2.5 rounded-lg"
                        style={{
                          background: "#EFF6FF",
                          color: "#1E40AF",
                        }}
                      >
                        {addon.detail}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-sm font-bold" style={{ color: "#1E293B" }}>
                      +{fmt(addon.price)}/yr
                    </div>
                    <button
                      onClick={() => onToggle(addon.id)}
                      className="addon-toggle-btn px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{
                        background: isSel ? "#1D4ED8" : "#F1F5F9",
                        color: isSel ? "white" : "#374151",
                      }}
                    >
                      {isSel ? (
                        <span className="flex items-center gap-1.5">
                          Added
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAddons.length > 0 && (
        <div
          className="rounded-xl px-5 py-4 mb-6 flex items-center justify-between"
          style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
        >
          <div>
            <div className="text-sm font-semibold" style={{ color: "#1E293B" }}>
              {selectedAddons.length} add-on
              {selectedAddons.length > 1 ? "s" : ""} selected
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>
              +{fmt(addonsTotal)}/year added to your premium
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={onSkip}
          className="text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          style={{ color: "#64748B" }}
        >
          Skip for now
        </button>
        <Btn onClick={onContinue} className="flex-1 justify-center">
          Continue
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Btn>
      </div>
    </PageWrap>
  );
}

// ─── Review Quote ─────────────────────────────────────────────────────────────

function ReviewScreen({
  selectedPlanId,
  selectedAddons,
  onChangePlan,
  onEditAddons,
  onEditVehicle,
  onProceed,
}: {
  selectedPlanId: string;
  selectedAddons: string[];
  onChangePlan: () => void;
  onEditAddons: () => void;
  onEditVehicle: () => void;
  onProceed: () => void;
}) {
  const plan = PLANS.find((p) => p.id === selectedPlanId)!;
  const addonsSelected = ADDONS.filter((a) =>
    selectedAddons.includes(a.id)
  );
  const addonsTotal = addonsSelected.reduce((s, a) => s + a.price, 0);
  const taxes = 650;
  const total = plan.price + addonsTotal + taxes;

  return (
    <PageWrap>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
        Review your quote
      </h1>
      <p className="mb-8" style={{ color: "#64748B" }}>
        Check your cover and premium before continuing.
      </p>

      <div className="space-y-4 mb-8">
        {/* Vehicle */}
        <div
          className="rounded-xl p-5"
          style={{ background: "white", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "#94A3B8" }}
              >
                Vehicle
              </div>
              <div className="text-base font-semibold" style={{ color: "#1E293B" }}>
                Hyundai Creta SX(O)
              </div>
              <div className="text-sm mt-0.5" style={{ color: "#64748B" }}>
                2023 · Petrol
              </div>
            </div>
            <button
              onClick={onEditVehicle}
              className="text-xs font-semibold"
              style={{ color: "#1D4ED8" }}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Plan */}
        <div
          className="rounded-xl p-5"
          style={{ background: "white", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "#94A3B8" }}
              >
                Selected plan
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-base font-semibold"
                  style={{ color: "#1E293B" }}
                >
                  {plan.name}
                </span>
                {plan.badge && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "#FEF3C7",
                      color: "#D97706",
                    }}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onChangePlan}
              className="text-xs font-semibold"
              style={{ color: "#1D4ED8" }}
            >
              Change
            </button>
          </div>
          <div className="space-y-2">
            {plan.highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 text-sm" style={{ color: "#475569" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                  <circle cx="7" cy="7" r="6" fill="#DCFCE7" />
                  <path
                    d="M4.5 7l2 2 3-3.5"
                    stroke="#16A34A"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div
          className="rounded-xl p-5"
          style={{ background: "white", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#94A3B8" }}
            >
              Add-ons
            </div>
            <button
              onClick={onEditAddons}
              className="text-xs font-semibold"
              style={{ color: "#1D4ED8" }}
            >
              Edit
            </button>
          </div>
          {addonsSelected.length > 0 ? (
            <div className="space-y-2.5">
              {addonsSelected.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: "#475569" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                      <circle cx="7" cy="7" r="6" fill="#DCFCE7" />
                      <path d="M4.5 7l2 2 3-3.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {a.name}
                  </div>
                  <span style={{ color: "#64748B" }}>+{fmt(a.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              No add-ons selected.
            </p>
          )}
        </div>

        {/* Price breakdown */}
        <div
          className="rounded-xl p-5"
          style={{ background: "white", border: "1px solid #E2E8F0" }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#94A3B8" }}
          >
            Premium breakdown
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: "#475569" }}>
                Base premium ({plan.name})
              </span>
              <span className="font-medium" style={{ color: "#1E293B" }}>
                {fmt(plan.price)}
              </span>
            </div>
            {addonsSelected.length > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#475569" }}>Add-ons</span>
                <span className="font-medium" style={{ color: "#1E293B" }}>
                  +{fmt(addonsTotal)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span style={{ color: "#475569" }}>Taxes & fees (GST)</span>
              <span className="font-medium" style={{ color: "#1E293B" }}>
                +{fmt(taxes)}
              </span>
            </div>
          </div>
          <div
            className="flex items-baseline justify-between mt-4 pt-4"
            style={{ borderTop: "1.5px solid #E2E8F0" }}
          >
            <span
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "#64748B" }}
            >
              Total payable
            </span>
            <div>
              <span
                className="text-3xl font-bold"
                style={{ color: "#0F172A" }}
              >
                {fmt(total)}
              </span>
              <span className="text-sm ml-1" style={{ color: "#94A3B8" }}>
                /year
              </span>
            </div>
          </div>
        </div>
      </div>

      <p
        className="text-xs flex items-center gap-1.5 mb-6"
        style={{ color: "#94A3B8" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
          <path
            d="M6 5.5v2.5M6 4.2h.01"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        {"You'll receive your policy documents after successful payment."}
      </p>

      <Btn onClick={onProceed} className="w-full justify-center py-4 text-sm">
        Proceed to payment
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Btn>
    </PageWrap>
  );
}

// ─── Payment ──────────────────────────────────────────────────────────────────

function PaymentScreen({
  total,
  paymentMethod,
  setPaymentMethod,
  onBack,
  onPay,
  onFail,
}: {
  total: number;
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  onBack: () => void;
  onPay: () => void;
  onFail: () => void;
}) {
  const methods = [
    { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm & more" },
    {
      id: "card",
      label: "Credit / Debit Card",
      hint: "Visa, Mastercard, RuPay",
    },
    { id: "netbanking", label: "Net Banking", hint: "All major banks supported" },
  ];

  const icons: Record<string, ReactNode> = {
    upi: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="4" fill="#6366F1" />
        <path d="M5 10l3 4 7-8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    card: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="4" width="18" height="12" rx="2" stroke="#475569" strokeWidth="1.4" />
        <path d="M1 8h18" stroke="#475569" strokeWidth="1.4" />
        <rect x="3" y="11" width="4" height="2" rx="0.5" fill="#CBD5E1" />
      </svg>
    ),
    netbanking: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l8 4v1H2V6l8-4z" stroke="#475569" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M4 7v8M8 7v8M12 7v8M16 7v8" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M2 15h16" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <PageWrap>
      <BackBtn onClick={onBack} />
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
        Complete your payment
      </h1>
      <p className="mb-8" style={{ color: "#64748B" }}>
        {"Choose how you'd like to pay for your policy."}
      </p>

      <div
        className="rounded-xl p-6 text-white mb-8"
        style={{ background: "#1D4ED8" }}
      >
        <div className="text-sm font-medium mb-1" style={{ color: "#BFDBFE" }}>
          Amount payable
        </div>
        <div className="text-4xl font-bold">{fmt(total)}</div>
        <div className="text-sm mt-1" style={{ color: "#93C5FD" }}>
          Annual premium · Policy period: 12 months
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setPaymentMethod(m.id)}
            className={`payment-method w-full flex items-center gap-4 p-4 rounded-xl text-left${paymentMethod === m.id ? " payment-active" : ""}`}
            style={{
              border:
                paymentMethod === m.id
                  ? "2px solid #1D4ED8"
                  : "2px solid #E2E8F0",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "#F8FAFC" }}
            >
              {icons[m.id]}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: "#1E293B" }}>
                {m.label}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                {m.hint}
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                border:
                  paymentMethod === m.id
                    ? "2px solid #1D4ED8"
                    : "2px solid #CBD5E1",
                background:
                  paymentMethod === m.id ? "#1D4ED8" : "transparent",
              }}
            >
              {paymentMethod === m.id && (
                <div
                  className="w-2 h-2 rounded-full bg-white"
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <div
        className="flex items-center gap-2 text-xs mb-6"
        style={{ color: "#94A3B8" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1L1.5 4v3.5c0 3 2.5 5.6 5.5 6.5 3-.9 5.5-3.5 5.5-6.5V4L7 1z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
        Your payment is secure and encrypted with 256-bit SSL.
      </div>

      <Btn onClick={onPay} className="w-full justify-center py-4 text-sm mb-3">
        Pay {fmt(total)}
      </Btn>

      <button
        onClick={onFail}
        className="w-full text-center text-xs py-2 transition-colors"
        style={{ color: "#CBD5E1" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
      >
        Simulate payment failure (for testing)
      </button>
    </PageWrap>
  );
}

// ─── Processing ───────────────────────────────────────────────────────────────

function ProcessingScreen() {
  return (
    <PageWrap>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-16 h-16 rounded-full border-4 animate-spin mb-6"
          style={{
            borderColor: "#BFDBFE",
            borderTopColor: "#1D4ED8",
          }}
        />
        <h1 className="text-xl font-bold mb-2" style={{ color: "#0F172A" }}>
          Processing your payment...
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Please {"don't"} close this window.
        </p>
      </div>
    </PageWrap>
  );
}

// ─── Payment Failed ───────────────────────────────────────────────────────────

function FailedScreen({
  onRetry,
  onChangeMethod,
}: {
  onRetry: () => void;
  onChangeMethod: () => void;
}) {
  return (
    <PageWrap>
      <div className="flex flex-col items-center text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#FEF2F2" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M8 8l12 12M20 8L8 20"
              stroke="#DC2626"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ color: "#0F172A" }}>
          Payment {"wasn't"} completed
        </h1>
        <p className="mb-2" style={{ color: "#64748B" }}>
          Your payment could not be processed.
        </p>
        <p className="text-sm mb-8 max-w-sm" style={{ color: "#94A3B8" }}>
          Your insurance policy has not been purchased. Your quote and
          selections have been saved.
        </p>

        <div
          className="rounded-xl p-4 mb-8 w-full max-w-sm text-left"
          style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
        >
          <div className="text-sm font-semibold mb-1" style={{ color: "#92400E" }}>
            Your quote is saved
          </div>
          <div className="text-xs" style={{ color: "#B45309" }}>
            Your plan selection and add-ons are kept. Retry or choose a
            different payment method.
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Btn onClick={onRetry} className="w-full justify-center py-3.5">
            Try payment again
          </Btn>
          <Btn
            variant="secondary"
            onClick={onChangeMethod}
            className="w-full justify-center"
          >
            Choose another payment method
          </Btn>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────

function SuccessScreen({ onReset }: { onReset: () => void }) {
  const details: [string, string][] = [
    ["Vehicle", "Hyundai Creta SX(O)"],
    ["Coverage period", "29 Aug 2026 – 28 Aug 2027"],
    ["Premium paid", "₹19,450"],
    ["Status", "Active"],
  ];

  return (
    <PageWrap>
      <div className="flex flex-col items-center text-center py-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#DCFCE7" }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M8 18l7 7 13-13"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
          Your car insurance is active
        </h1>
        <p className="mb-8" style={{ color: "#64748B" }}>
          Your policy has been successfully purchased.
        </p>

        <div
          className="rounded-2xl w-full max-w-sm mb-8 overflow-hidden text-left"
          style={{ border: "1px solid #E2E8F0" }}
        >
          <div
            className="px-6 py-5"
            style={{ background: "#065F46" }}
          >
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "#6EE7B7" }}
            >
              Policy number
            </div>
            <div
              className="text-xl font-bold"
              style={{
                color: "white",
                fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.05em",
              }}
            >
              TJ-482910
            </div>
          </div>
          {details.map(([label, value], i) => (
            <div
              key={label}
              className="flex items-center justify-between px-5 py-4"
              style={{
                background: "white",
                borderBottom:
                  i < details.length - 1 ? "1px solid #F1F5F9" : "none",
              }}
            >
              <span className="text-sm" style={{ color: "#64748B" }}>
                {label}
              </span>
              <span
                className="text-sm font-semibold"
                style={{
                  color: label === "Status" ? "#059669" : "#1E293B",
                }}
              >
                {label === "Status" ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: "#22C55E" }}
                    />
                    {value}
                  </span>
                ) : (
                  value
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Btn className="w-full justify-center py-3.5">View policy</Btn>
          <Btn variant="secondary" className="w-full justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v8M4 6l4 4 4-4M2 13h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download policy
          </Btn>
          <button
            onClick={onReset}
            className="w-full text-sm font-semibold py-2.5 rounded-lg transition-colors"
            style={{ color: "#64748B" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1E293B")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
          >
            Go to dashboard
          </button>
        </div>

        <p className="mt-8 text-xs max-w-sm" style={{ color: "#94A3B8" }}>
          Your policy documents have been sent to your registered email address.
        </p>
      </div>
    </PageWrap>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [reg, setReg] = useState("");
  const [regError, setRegError] = useState<RegError | null>(null);
  const [carUse, setCarUse] = useState("");
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);
  const [expiry, setExpiry] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("recommended");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showCompare, setShowCompare] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlan)!;
  const addonsTotal = ADDONS.filter((a) =>
    selectedAddons.includes(a.id)
  ).reduce((s, a) => s + a.price, 0);
  const total = plan.price + addonsTotal + 650;

  useEffect(() => {
    if (step === "loading") {
      const t = setTimeout(() => setStep("vehicle"), 2000);
      return () => clearTimeout(t);
    }
    if (step === "processing") {
      const t = setTimeout(() => setStep("success"), 2500);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleRegSubmit = () => {
    if (!reg.trim()) return;
    if (reg.trim().toUpperCase() === "INVALID") {
      setRegError({
        title: "We couldn't find a vehicle with this registration number.",
        hint: "Check the registration number and try again.",
      });
      return;
    }
    const validationError = validateRegNumber(reg);
    if (validationError) {
      setRegError(validationError);
      return;
    }
    setRegError(null);
    setStep("loading");
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    setStep("landing");
    setReg("");
    setRegError(null);
    setCarUse("");
    setHasInsurance(null);
    setExpiry("");
    setSelectedPlan("recommended");
    setSelectedAddons([]);
    setPaymentMethod("upi");
  };

  const showProgress = !["landing", "success", "processing"].includes(step);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F8FAFC",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Header showHelp onLogoClick={resetAll} />
      {showProgress && <ProgressBar step={step} />}

      {step === "landing" && (
        <LandingScreen onStart={() => setStep("registration")} />
      )}

      {step === "registration" && (
        <RegistrationScreen
          reg={reg}
          setReg={(v) => {
            setReg(v);
            setRegError(null);
          }}
          onBack={() => setStep("landing")}
          onSubmit={handleRegSubmit}
          error={regError}
        />
      )}

      {step === "loading" && <LoadingScreen />}

      {step === "vehicle" && (
        <VehicleScreen
          onConfirm={() => setStep("details")}
          onWrong={() => {
            setReg("");
            setRegError(null);
            setStep("registration");
          }}
        />
      )}

      {step === "details" && (
        <DetailsScreen
          carUse={carUse}
          setCarUse={setCarUse}
          hasInsurance={hasInsurance}
          setHasInsurance={setHasInsurance}
          expiry={expiry}
          setExpiry={setExpiry}
          onBack={() => setStep("vehicle")}
          onContinue={() => setStep("plans")}
        />
      )}

      {step === "plans" && (
        <>
          <PlansScreen
            selected={selectedPlan}
            onSelect={setSelectedPlan}
            onCompare={() => setShowCompare(true)}
            onBack={() => setStep("details")}
            onContinue={() => setStep("addons")}
          />
          {showCompare && (
            <ComparePlansModal
              selected={selectedPlan}
              onSelect={setSelectedPlan}
              onClose={() => setShowCompare(false)}
            />
          )}
        </>
      )}

      {step === "addons" && (
        <AddOnsScreen
          selectedPlan={selectedPlan}
          selectedAddons={selectedAddons}
          onToggle={toggleAddon}
          onBack={() => setStep("plans")}
          onContinue={() => setStep("review")}
          onSkip={() => {
            setSelectedAddons([]);
            setStep("review");
          }}
        />
      )}

      {step === "review" && (
        <ReviewScreen
          selectedPlanId={selectedPlan}
          selectedAddons={selectedAddons}
          onChangePlan={() => setStep("plans")}
          onEditAddons={() => setStep("addons")}
          onEditVehicle={() => setStep("vehicle")}
          onProceed={() => setStep("payment")}
        />
      )}

      {step === "payment" && (
        <PaymentScreen
          total={total}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onBack={() => setStep("review")}
          onPay={() => setStep("processing")}
          onFail={() => setStep("failed")}
        />
      )}

      {step === "processing" && <ProcessingScreen />}

      {step === "failed" && (
        <FailedScreen
          onRetry={() => setStep("processing")}
          onChangeMethod={() => setStep("payment")}
        />
      )}

      {step === "success" && <SuccessScreen onReset={resetAll} />}
    </div>
  );
}
