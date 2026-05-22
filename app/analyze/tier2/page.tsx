"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tier2Data = {
  hasGBP: boolean | null;
  starRating: number | null;
  isLLC: boolean | null;
  hasInsurance: boolean | null;
  hasBusinessBank: boolean | null;
  tracksMileage: boolean | null;
  setsAsideTaxes: boolean | null;
  hasServiceAgreement: boolean | null;
  collectsReviews: boolean | null;
};

const INITIAL: Tier2Data = {
  hasGBP: null,
  starRating: null,
  isLLC: null,
  hasInsurance: null,
  hasBusinessBank: null,
  tracksMileage: null,
  setsAsideTaxes: null,
  hasServiceAgreement: null,
  collectsReviews: null,
};

export default function Tier2Page() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Tier2Data>(INITIAL);
  const [analyzing, setAnalyzing] = useState(false);

  // Determine visible steps: if no GBP skip star rating
  function getSteps() {
    const steps: { key: keyof Tier2Data; question: string; type: "yesno" | "stars" }[] = [
      { key: "hasGBP", question: "Do you have a Google Business Profile?", type: "yesno" },
    ];
    if (data.hasGBP === true) {
      steps.push({ key: "starRating", question: "What is your current Google star rating?", type: "stars" });
    }
    steps.push(
      { key: "isLLC", question: "Are you registered as an LLC or business entity?", type: "yesno" },
      { key: "hasInsurance", question: "Do you have general liability insurance?", type: "yesno" },
      { key: "hasBusinessBank", question: "Do you have a separate business bank account?", type: "yesno" },
      { key: "tracksMileage", question: "Do you track your business mileage for tax deductions?", type: "yesno" },
      { key: "setsAsideTaxes", question: "Do you set aside money for quarterly taxes?", type: "yesno" },
      { key: "hasServiceAgreement", question: "Do you have a written service agreement customers sign?", type: "yesno" },
      { key: "collectsReviews", question: "Do you have a consistent way to collect Google reviews after jobs?", type: "yesno" }
    );
    return steps;
  }

  const steps = getSteps();
  const TOTAL_STEPS = steps.length;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const currentStep = steps[step];

  function canAdvance(): boolean {
    const val = data[currentStep.key];
    if (currentStep.type === "yesno") return val !== null;
    if (currentStep.type === "stars") return val !== null && (val as number) >= 1;
    return false;
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else handleFinish();
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function handleFinish() {
    setAnalyzing(true);
    localStorage.setItem("tier2", JSON.stringify(data));
    const tier1 = JSON.parse(localStorage.getItem("tier1") || "{}");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier1, tier2: data }),
    });

    const result = await res.json();
    localStorage.setItem("analysisResult", JSON.stringify(result));
    router.push("/analyze/results");
  }

  const btnBase = {
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "16px",
    fontSize: "20px",
    fontWeight: "600",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    padding: "20px 0",
    width: "100%",
  };

  if (analyzing) {
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
          Analyzing your business data...
        </p>
        <p className="text-sm" style={{ color: "#1e3a52" }}>
          Generating specific dollar amounts for every insight
        </p>
      </div>
    );
  }

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
          <div className="mb-6">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#112236", color: "#0096C7", border: "1px solid #1e3a52" }}
            >
              Tier 2 — Business Foundation
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold mb-10"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {currentStep.question}
          </h1>

          {/* Yes / No buttons */}
          {currentStep.type === "yesno" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setData({ ...data, [currentStep.key]: true })}
                style={{
                  ...btnBase,
                  backgroundColor: data[currentStep.key] === true ? "#00B4D8" : "#0D1B2A",
                  color: data[currentStep.key] === true ? "#080E14" : "#e8f0f5",
                  border: `2px solid ${data[currentStep.key] === true ? "#00B4D8" : "#1e3a52"}`,
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setData({ ...data, [currentStep.key]: false })}
                style={{
                  ...btnBase,
                  backgroundColor: data[currentStep.key] === false ? "#EF4444" : "#0D1B2A",
                  color: data[currentStep.key] === false ? "#ffffff" : "#8BAABB",
                  border: `2px solid ${data[currentStep.key] === false ? "#EF4444" : "#1e3a52"}`,
                }}
              >
                No
              </button>
            </div>
          )}

          {/* Star rating */}
          {currentStep.type === "stars" && (
            <div>
              <p className="text-sm mb-6" style={{ color: "#8BAABB" }}>
                Tap the number of stars that matches your current rating.
              </p>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setData({ ...data, starRating: star })}
                    className="transition-all duration-200"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      fontSize: "24px",
                      border: `2px solid ${(data.starRating ?? 0) >= star ? "#00B4D8" : "#1e3a52"}`,
                      backgroundColor: (data.starRating ?? 0) >= star ? "#112236" : "#0D1B2A",
                      cursor: "pointer",
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {data.starRating && (
                <p className="text-center mt-4 text-sm" style={{ color: "#00B4D8" }}>
                  {data.starRating}.0 stars selected
                </p>
              )}
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
                Next Question
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canAdvance() || analyzing}
                className="flex-1 py-4 rounded-xl font-semibold transition-all duration-200"
                style={{
                  backgroundColor: canAdvance() && !analyzing ? "#00B4D8" : "#1e3a52",
                  color: canAdvance() && !analyzing ? "#080E14" : "#8BAABB",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: canAdvance() && !analyzing ? "pointer" : "not-allowed",
                }}
              >
                Get My Analysis →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
