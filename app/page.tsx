"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const SUBSCORES = [
  { label: "Financial Health", value: 78 },
  { label: "Pricing vs Market", value: 62 },
  { label: "Google Presence", value: 30 },
  { label: "Business Foundation", value: 65 },
  { label: "Revenue Efficiency", value: 82 },
];

const ACTION_ITEMS = [
  {
    title: "Raise your oil change price by $15",
    description:
      "Your $89 full-synthetic rate sits $15 below the local market median of $104. At 22 jobs/month, this single adjustment adds $3,960/year to your bottom line.",
    dollar: "+$3,960/yr",
  },
  {
    title: "Claim and optimize your Google Business Profile",
    description:
      "Mobile mechanics with a verified GBP average 18 new inbound calls per month. At your close rate, that's roughly $2,800 in additional monthly revenue.",
    dollar: "+$2,800/mo",
  },
  {
    title: "Set aside 25% for quarterly taxes now",
    description:
      "Based on $6,400/month revenue, your estimated quarterly tax liability is $3,840. Skipping this creates a $15,360 annual liability — most techs use a separate savings account.",
    dollar: "Avoid $15,360",
  },
];

const VERTICALS = [
  {
    icon: "🔧",
    title: "Mobile Mechanics",
    desc: "Pricing benchmarks, labor rate analysis, and route efficiency for mobile repair techs.",
  },
  {
    icon: "✨",
    title: "Mobile Detailers",
    desc: "Package pricing, upsell tracking, and customer retention strategies for detail pros.",
  },
  {
    icon: "🚗",
    title: "Mobile Tire Service",
    desc: "Markup analysis, fleet account strategy, and seasonal demand planning for tire techs.",
  },
];

export default function Home() {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E14", color: "#e8f0f5" }}>
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 sm:px-8"
        style={{ backgroundColor: "#080E14", borderBottom: "1px solid #1e3a52" }}
      >
        <span
          className="text-lg sm:text-xl font-bold tracking-tight"
          style={{ fontFamily: "Syne, sans-serif", color: "#00B4D8" }}
        >
          Mobile Service Coach
        </span>
        <Link
          href="/analyze/tier1"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ backgroundColor: "#00B4D8", color: "#080E14", fontFamily: "DM Sans, sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0096C7")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B4D8")}
        >
          Get Free Analysis
        </Link>
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-20 px-4 sm:px-8 text-center max-w-4xl mx-auto">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ backgroundColor: "#112236", color: "#00B4D8", border: "1px solid #1e3a52" }}
        >
          Free · No credit card · 7 minutes
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-balance"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Know your numbers.
          <br />
          <span style={{ color: "#00B4D8" }}>Build your business.</span>
        </h1>
        <p
          className="text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          style={{ color: "#8BAABB", fontFamily: "DM Sans, sans-serif" }}
        >
          Free AI business analysis for mobile service professionals. Seven minutes.
          Specific dollar amounts on every insight.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/analyze/tier1"
            className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200"
            style={{ backgroundColor: "#00B4D8", color: "#080E14", fontFamily: "DM Sans, sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0096C7")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B4D8")}
          >
            Start Free Analysis
          </Link>
          <a
            href="#how"
            className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200"
            style={{
              border: "1px solid #1e3a52",
              color: "#e8f0f5",
              backgroundColor: "transparent",
              fontFamily: "DM Sans, sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0D1B2A")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            How It Works
          </a>
        </div>
      </section>

      {/* SAMPLE SCORE PREVIEW */}
      <section className="px-4 sm:px-8 pb-20 max-w-3xl mx-auto">
        <p className="text-center text-sm mb-6" style={{ color: "#8BAABB" }}>
          Example report preview — your actual results will be based on your data
        </p>
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{ backgroundColor: "#0D1B2A", border: "1px solid #1e3a52" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
                style={{ border: "4px solid #00B4D8", backgroundColor: "#112236" }}
              >
                <span
                  className="text-4xl font-extrabold"
                  style={{ fontFamily: "Syne, sans-serif", color: "#00B4D8" }}
                >
                  71
                </span>
                <span className="text-xs" style={{ color: "#8BAABB" }}>
                  / 100
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h2
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Business Health Score
              </h2>
              <p className="text-sm" style={{ color: "#8BAABB" }}>
                Strong revenue efficiency offset by weak Google presence. Focus on visibility first.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {SUBSCORES.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "#8BAABB" }}>{s.label}</span>
                  <span
                    className="font-semibold"
                    style={{ color: s.value < 50 ? "#f87171" : s.value < 70 ? "#fbbf24" : "#00B4D8" }}
                  >
                    {s.value}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#112236" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.value}%`,
                      backgroundColor: s.value < 50 ? "#f87171" : s.value < 70 ? "#fbbf24" : "#00B4D8",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#8BAABB", fontFamily: "Syne, sans-serif" }}
            >
              Top Action Items
            </h3>
            {ACTION_ITEMS.map((a) => (
              <div
                key={a.title}
                className="rounded-xl p-4"
                style={{ backgroundColor: "#112236", border: "1px solid #1e3a52" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {a.title}
                  </p>
                  <span
                    className="text-sm font-bold whitespace-nowrap flex-shrink-0"
                    style={{ color: "#00B4D8", fontFamily: "Syne, sans-serif" }}
                  >
                    {a.dollar}
                  </span>
                </div>
                <p className="text-xs mt-2" style={{ color: "#8BAABB" }}>
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO-TIER EXPLANATION */}
      <section className="px-4 sm:px-8 pb-20 max-w-4xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-10"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Two focused tiers. One complete picture.
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              tier: "Tier 1",
              title: "Financial Health",
              time: "3 minutes",
              color: "#00B4D8",
              items: [
                "Revenue analysis vs. local benchmarks",
                "Pricing comparison for your top service",
                "Service mix efficiency scoring",
                "Revenue gap identification with dollar amounts",
              ],
            },
            {
              tier: "Tier 2",
              title: "Business Foundation",
              time: "4 minutes",
              color: "#0096C7",
              items: [
                "Google Business Profile status",
                "LLC / business entity formation",
                "General liability insurance coverage",
                "Business banking separation",
                "Mileage tracking for tax deductions",
                "Review collection system",
              ],
            },
          ].map((t) => (
            <div
              key={t.tier}
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#0D1B2A", border: "1px solid #1e3a52" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ backgroundColor: t.color, color: "#080E14", fontFamily: "Syne, sans-serif" }}
                >
                  {t.tier}
                </span>
                <span className="text-xs" style={{ color: "#8BAABB" }}>
                  {t.time}
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {t.title}
              </h3>
              <ul className="space-y-2">
                {t.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#8BAABB" }}>
                    <span style={{ color: t.color }} className="mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-4 sm:px-8 pb-20 max-w-4xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-10"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Upload data or answer manually",
              desc: "Drop in a CSV/XLSX from your invoicing software, or just answer a few quick questions.",
            },
            {
              step: "02",
              title: "Complete two focused tiers",
              desc: "Tier 1 covers your financials. Tier 2 covers your business infrastructure. Seven minutes total.",
            },
            {
              step: "03",
              title: "Get your Business Health Report",
              desc: "Receive a scored report with specific dollar amounts on every recommendation.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: "#0D1B2A", border: "1px solid #1e3a52" }}
            >
              <div
                className="text-4xl font-extrabold mb-4"
                style={{ fontFamily: "Syne, sans-serif", color: "#1e3a52" }}
              >
                {s.step}
              </div>
              <h3 className="font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                {s.title}
              </h3>
              <p className="text-sm" style={{ color: "#8BAABB" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VERTICALS */}
      <section className="px-4 sm:px-8 pb-20 max-w-4xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-10"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Built for mobile service pros
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {VERTICALS.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: "#0D1B2A", border: "1px solid #1e3a52" }}
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                {v.title}
              </h3>
              <p className="text-sm" style={{ color: "#8BAABB" }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD SECTION */}
      <section className="px-4 sm:px-8 pb-20 max-w-2xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Start with your data
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: "#8BAABB" }}>
          Upload a CSV or XLSX from your invoicing software to pre-fill your analysis.
        </p>
        <div
          className={`rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${dragOver ? "opacity-100" : "opacity-90"}`}
          style={{
            border: `2px dashed ${dragOver ? "#00B4D8" : "#1e3a52"}`,
            backgroundColor: dragOver ? "#112236" : "#0D1B2A",
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-4xl mb-4">📁</div>
          <p className="font-medium mb-2">Drop your CSV or XLSX here</p>
          <p className="text-sm" style={{ color: "#8BAABB" }}>
            or click to browse
          </p>
          <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" />
        </div>
        <div className="text-center mt-6">
          <span className="text-sm" style={{ color: "#8BAABB" }}>
            No file?{" "}
          </span>
          <Link
            href="/analyze/tier1"
            className="text-sm font-medium underline underline-offset-2"
            style={{ color: "#00B4D8" }}
          >
            Answer questions manually instead
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="px-4 sm:px-8 py-20 text-center"
        style={{ backgroundColor: "#0D1B2A", borderTop: "1px solid #1e3a52" }}
      >
        <h2
          className="text-3xl sm:text-4xl font-extrabold mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Your business. Your numbers.
          <br />
          <span style={{ color: "#00B4D8" }}>No fluff, no guessing.</span>
        </h2>
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: "#8BAABB" }}>
          Seven minutes to a complete picture of where you stand and exactly what to do next.
        </p>
        <Link
          href="/analyze/tier1"
          className="inline-block px-10 py-4 rounded-xl text-base font-semibold transition-all duration-200"
          style={{ backgroundColor: "#00B4D8", color: "#080E14", fontFamily: "DM Sans, sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0096C7")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B4D8")}
        >
          Start Free Analysis
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        className="px-4 sm:px-8 py-8 text-center text-sm"
        style={{ borderTop: "1px solid #1e3a52", color: "#8BAABB" }}
      >
        <p>© {new Date().getFullYear()} Mobile Service Coach. A National Wrench Index LLC product.</p>
      </footer>
    </div>
  );
}
