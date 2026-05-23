"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Action = { title: string; description: string; dollarImpact: string };
type GuidanceItem = { title: string; steps: string[] };

type AnalysisResult = {
  businessHealthScore: number;
  subscores: {
    financialHealth: number;
    pricing: number;
    googlePresence: number;
    businessFoundation: number;
    revenueEfficiency: number;
  };
  topActions: Action[];
  infrastructureGuidance: Record<string, GuidanceItem>;
};

const SUBSCORE_LABELS: Record<string, string> = {
  financialHealth: "Financial Health",
  pricing: "Pricing vs Market",
  googlePresence: "Google Presence",
  businessFoundation: "Business Foundation",
  revenueEfficiency: "Revenue Efficiency",
};

function ScoreColor(val: number) {
  if (val < 50) return "#f87171";
  if (val < 70) return "#fbbf24";
  return "#00B4D8";
}

function CollapsibleGuidance({ title, steps }: GuidanceItem) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden w-full"
      style={{ border: "1px solid #1e3a52", backgroundColor: "#0D1B2A" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-200"
        style={{ backgroundColor: open ? "#112236" : "transparent" }}
      >
        <span className="font-semibold text-sm pr-4 break-words min-w-0" style={{ fontFamily: "Syne, sans-serif" }}>
          {title}
        </span>
        <span style={{ color: "#00B4D8", fontSize: "18px", flexShrink: 0 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <ol className="space-y-3 mt-2">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm break-words" style={{ color: "#8BAABB" }}>
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#112236", color: "#00B4D8" }}
                >
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed.businessHealthScore === "number" &&
          parsed.subscores &&
          Array.isArray(parsed.topActions) &&
          parsed.infrastructureGuidance
        ) {
          setResult(parsed);
        } else {
          setError("The analysis result was incomplete. Please try again.");
        }
      } catch {
        setError("Could not load your results. Please try again.");
      }
    } else {
      setError("No analysis found. Please complete the questionnaire first.");
    }
    setLoading(false);
  }, []);

  async function sendReport() {
    if (!email || !result) return;
    setSending(true);
    try {
      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, analysis: result }),
      });
      setEmailSent(true);
    } catch {
      // silently fail — report was generated
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ backgroundColor: "#080E14" }}
      >
        <div
          className="w-20 h-20 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#1e3a52", borderTopColor: "#00B4D8" }}
        />
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: "Syne, sans-serif", color: "#8BAABB" }}
        >
          Analyzing your business...
        </p>
        <p className="text-sm" style={{ color: "#1e3a52" }}>
          Generating specific dollar amounts for every insight
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: "#080E14" }}
      >
        <p className="text-lg text-center" style={{ color: "#f87171" }}>
          {error || "Something went wrong."}
        </p>
        <Link
          href="/analyze/tier1"
          className="px-6 py-3 rounded-xl font-semibold"
          style={{ backgroundColor: "#00B4D8", color: "#080E14" }}
        >
          Start Over
        </Link>
      </div>
    );
  }

  const score = result.businessHealthScore;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E14" }}>
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{ backgroundColor: "#080E14", borderBottom: "1px solid #1e3a52" }}
      >
        <span
          className="text-base font-bold"
          style={{ fontFamily: "Syne, sans-serif", color: "#00B4D8" }}
        >
          Mobile Service Coach
        </span>
        <Link
          href="/analyze/tier1"
          className="text-sm"
          style={{ color: "#8BAABB" }}
        >
          Start Over
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Score circle */}
        <div className="text-center">
          <h1
            className="text-2xl sm:text-3xl font-extrabold mb-6"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Your Business Health Report
          </h1>
          <div className="flex justify-center mb-4">
            <div className="relative w-36 h-36">
              <svg width="144" height="144" viewBox="0 0 144 144">
                <circle cx="72" cy="72" r="54" fill="none" stroke="#1e3a52" strokeWidth="10" />
                <circle
                  cx="72"
                  cy="72"
                  r="54"
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform="rotate(-90 72 72)"
                  style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-4xl font-extrabold"
                  style={{ fontFamily: "Syne, sans-serif", color: "#00B4D8" }}
                >
                  {score}
                </span>
                <span className="text-xs" style={{ color: "#8BAABB" }}>
                  out of 100
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm" style={{ color: "#8BAABB" }}>
            Business Health Score
          </p>
        </div>

        {/* Subscores */}
        <div
          className="rounded-2xl p-6 overflow-hidden w-full"
          style={{ backgroundColor: "#0D1B2A", border: "1px solid #1e3a52" }}
        >
          <h2
            className="text-base font-bold mb-5"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Score Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(result.subscores).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "#8BAABB" }}>
                    {SUBSCORE_LABELS[key] || key}
                  </span>
                  <span className="font-semibold" style={{ color: ScoreColor(val) }}>
                    {val}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#112236" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${val}%`, backgroundColor: ScoreColor(val) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Actions */}
        <div>
          <h2
            className="text-xl font-bold mb-4"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Top 3 Action Items
          </h2>
          <div className="space-y-4">
            {result.topActions.map((a, i) => (
              <div
                key={i}
                className="rounded-xl p-5 overflow-hidden w-full"
                style={{ backgroundColor: "#0D1B2A", border: "1px solid #1e3a52" }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: "#00B4D8", color: "#080E14" }}
                    >
                      {i + 1}
                    </span>
                    <p className="font-semibold text-sm break-words min-w-0" style={{ fontFamily: "Syne, sans-serif" }}>
                      {a.title}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold flex-shrink-0 break-words"
                    style={{ color: "#00B4D8", fontFamily: "Syne, sans-serif" }}
                  >
                    {a.dollarImpact}
                  </span>
                </div>
                <p className="text-sm ml-9 break-words" style={{ color: "#8BAABB" }}>
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure guidance */}
        {Object.keys(result.infrastructureGuidance).length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Fix These Gaps
            </h2>
            <p className="text-sm mb-4" style={{ color: "#8BAABB" }}>
              Step-by-step instructions for each &quot;No&quot; answer.
            </p>
            <div className="space-y-3">
              {Object.entries(result.infrastructureGuidance).map(([key, item]) => (
                <CollapsibleGuidance key={key} title={item.title} steps={item.steps} />
              ))}
            </div>
          </div>
        )}

        {/* Email capture */}
        <div
          className="rounded-2xl p-6 overflow-hidden w-full"
          style={{ backgroundColor: "#0D1B2A", border: "1px solid #1e3a52" }}
        >
          <h2
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Get your report by email
          </h2>
          <p className="text-sm mb-5" style={{ color: "#8BAABB" }}>
            We&apos;ll send a formatted copy of this report to your inbox.
          </p>
          {emailSent ? (
            <div
              className="py-4 px-5 rounded-xl text-center text-sm font-medium"
              style={{ backgroundColor: "#112236", color: "#00B4D8" }}
            >
              Report sent! Check your inbox.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl text-sm"
                style={{
                  backgroundColor: "#112236",
                  border: "1px solid #1e3a52",
                  color: "#e8f0f5",
                  outline: "none",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />
              <button
                onClick={sendReport}
                disabled={sending || !email}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap"
                style={{
                  backgroundColor: email ? "#00B4D8" : "#1e3a52",
                  color: email ? "#080E14" : "#8BAABB",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: email ? "pointer" : "not-allowed",
                }}
              >
                {sending ? "Sending…" : "Send My Report"}
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center overflow-hidden w-full"
          style={{ backgroundColor: "#112236", border: "1px solid #1e3a52" }}
        >
          <h2
            className="text-xl sm:text-2xl font-extrabold mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Ready to automate everything we just identified?
          </h2>
          <p className="text-sm mb-6 break-words" style={{ color: "#8BAABB" }}>
            The National Wrench Index Suite handles invoicing, review collection, mileage tracking,
            and tax prep — built specifically for mobile service pros.
          </p>
          <a
            href="https://nationalwrenchindex.com/Suite"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-200"
            style={{ backgroundColor: "#00B4D8", color: "#080E14", fontFamily: "DM Sans, sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0096C7")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B4D8")}
          >
            Explore the Suite →
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-4 py-8 text-center text-sm mt-8"
        style={{ borderTop: "1px solid #1e3a52", color: "#8BAABB" }}
      >
        <p>© {new Date().getFullYear()} Mobile Service Coach. A National Wrench Index LLC product.</p>
      </footer>
    </div>
  );
}
