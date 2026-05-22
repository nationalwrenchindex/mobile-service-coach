"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TRADES = [
  { value: "Mobile Mechanic", icon: "🔧", desc: "Vehicle repair & maintenance" },
  { value: "Mobile Detailer", icon: "✨", desc: "Auto detailing & paint protection" },
  { value: "Mobile Tire Tech", icon: "🚗", desc: "Tire sales, install & repair" },
];

type Tier1Data = {
  trade: string;
  monthlyRevenue: string;
  jobsPerMonth: string;
  topService: string;
  servicePrice: string;
  monthlyExpenses: string;
  hoursPerDay: string;
  laborRate: string;
};

const INITIAL: Tier1Data = {
  trade: "",
  monthlyRevenue: "",
  jobsPerMonth: "",
  topService: "",
  servicePrice: "",
  monthlyExpenses: "",
  hoursPerDay: "",
  laborRate: "",
};

export default function Tier1Page() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Tier1Data>(INITIAL);

  const TOTAL_STEPS = 8;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else handleFinish();
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function handleFinish() {
    localStorage.setItem("tier1", JSON.stringify(data));
    router.push("/analyze/tier2");
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return data.trade !== "";
      case 1: return data.monthlyRevenue !== "";
      case 2: return data.jobsPerMonth !== "";
      case 3: return data.topService.trim() !== "";
      case 4: return data.servicePrice !== "";
      case 5: return data.monthlyExpenses !== "";
      case 6: return data.hoursPerDay !== "";
      case 7: return data.laborRate !== "";
      default: return false;
    }
  }

  const inputStyle = {
    backgroundColor: "#112236",
    border: "1px solid #1e3a52",
    color: "#e8f0f5",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "18px",
    width: "100%",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#080E14" }}>
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid #1e3a52" }}
      >
        <span
          className="text-base font-bold"
          style={{ fontFamily: "Syne, sans-serif", color: "#00B4D8" }}
        >
          Mobile Service Coach
        </span>
        <span className="text-sm" style={{ color: "#8BAABB" }}>
          Step {step + 1} of {TOTAL_STEPS}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ backgroundColor: "#1e3a52" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: "#00B4D8" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-xl mx-auto w-full">
        <div className="w-full">
          {/* Tier badge */}
          <div className="mb-6">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#112236", color: "#00B4D8", border: "1px solid #1e3a52" }}
            >
              Tier 1 — Financial Health
            </span>
          </div>

          {/* Step 0: Trade selection */}
          {step === 0 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                What trade do you work in?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                Select the option that best describes your business.
              </p>
              <div className="space-y-4">
                {TRADES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setData({ ...data, trade: t.value }); }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                    style={{
                      backgroundColor: data.trade === t.value ? "#112236" : "#0D1B2A",
                      border: `2px solid ${data.trade === t.value ? "#00B4D8" : "#1e3a52"}`,
                    }}
                  >
                    <span className="text-3xl">{t.icon}</span>
                    <div>
                      <div className="font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>
                        {t.value}
                      </div>
                      <div className="text-sm" style={{ color: "#8BAABB" }}>
                        {t.desc}
                      </div>
                    </div>
                    {data.trade === t.value && (
                      <span className="ml-auto text-xl" style={{ color: "#00B4D8" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Monthly Revenue */}
          {step === 1 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                What is your average monthly revenue?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                Include all income from services. Estimates are fine.
              </p>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold"
                  style={{ color: "#8BAABB" }}
                >
                  $
                </span>
                <input
                  type="number"
                  placeholder="6400"
                  value={data.monthlyRevenue}
                  onChange={(e) => setData({ ...data, monthlyRevenue: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: "36px" }}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Jobs per month */}
          {step === 2 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                How many jobs do you complete per month?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                Count each visit or appointment as one job.
              </p>
              <input
                type="number"
                placeholder="22"
                value={data.jobsPerMonth}
                onChange={(e) => setData({ ...data, jobsPerMonth: e.target.value })}
                style={inputStyle}
                autoFocus
              />
            </div>
          )}

          {/* Step 3: Top service */}
          {step === 3 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                What is your most common service?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                The service you perform most often each month.
              </p>
              <input
                type="text"
                placeholder="e.g. Full synthetic oil change"
                value={data.topService}
                onChange={(e) => setData({ ...data, topService: e.target.value })}
                style={inputStyle}
                autoFocus
              />
            </div>
          )}

          {/* Step 4: Service price */}
          {step === 4 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                What do you charge for that service?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                Your current price for{" "}
                <span style={{ color: "#00B4D8" }}>
                  {data.topService || "your top service"}
                </span>
                .
              </p>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold"
                  style={{ color: "#8BAABB" }}
                >
                  $
                </span>
                <input
                  type="number"
                  placeholder="89"
                  value={data.servicePrice}
                  onChange={(e) => setData({ ...data, servicePrice: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: "36px" }}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 5: Monthly expenses */}
          {step === 5 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                What are your monthly business expenses, roughly?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                Include supplies, fuel, tools, insurance, and subscriptions. Estimates are fine.
              </p>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold"
                  style={{ color: "#8BAABB" }}
                >
                  $
                </span>
                <input
                  type="number"
                  placeholder="1800"
                  value={data.monthlyExpenses}
                  onChange={(e) => setData({ ...data, monthlyExpenses: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: "36px" }}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 6: Hours per day */}
          {step === 6 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                How many hours per day do you typically work?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                On days you&apos;re working, how many hours are you in the field?
              </p>
              <input
                type="number"
                placeholder="8"
                value={data.hoursPerDay}
                onChange={(e) => setData({ ...data, hoursPerDay: e.target.value })}
                style={inputStyle}
                autoFocus
              />
            </div>
          )}

          {/* Step 7: Labor rate */}
          {step === 7 && (
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                What is your hourly labor rate?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#8BAABB" }}>
                What you charge customers per hour of labor.
              </p>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold"
                  style={{ color: "#8BAABB" }}
                >
                  $
                </span>
                <input
                  type="number"
                  placeholder="120"
                  value={data.laborRate}
                  onChange={(e) => setData({ ...data, laborRate: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: "36px" }}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-10">
            {step > 0 && (
              <button
                onClick={back}
                className="px-6 py-4 rounded-xl font-medium transition-all duration-200 flex-shrink-0"
                style={{
                  border: "1px solid #1e3a52",
                  color: "#8BAABB",
                  backgroundColor: "transparent",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Back
              </button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={next}
                disabled={!canAdvance()}
                className="flex-1 py-4 rounded-xl font-semibold transition-all duration-200"
                style={{
                  backgroundColor: canAdvance() ? "#00B4D8" : "#1e3a52",
                  color: canAdvance() ? "#080E14" : "#8BAABB",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: canAdvance() ? "pointer" : "not-allowed",
                }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canAdvance()}
                className="flex-1 py-4 rounded-xl font-semibold transition-all duration-200"
                style={{
                  backgroundColor: canAdvance() ? "#00B4D8" : "#1e3a52",
                  color: canAdvance() ? "#080E14" : "#8BAABB",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: canAdvance() ? "pointer" : "not-allowed",
                }}
              >
                Continue to Tier 2 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
