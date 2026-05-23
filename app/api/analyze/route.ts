import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert business coach specializing in mobile service businesses. You analyze real business data and deliver brutally honest, hyper-specific, immediately actionable insights. Every recommendation must include a specific dollar amount based on the actual data provided. Never give generic advice. Always anchor insights to real dollar amounts.

Generate a response as valid JSON only — no markdown, no code fences, no extra text — with this exact structure:
{
  "businessHealthScore": <number 0-100>,
  "subscores": {
    "financialHealth": <number 0-100>,
    "pricing": <number 0-100>,
    "googlePresence": <number 0-100>,
    "businessFoundation": <number 0-100>,
    "revenueEfficiency": <number 0-100>
  },
  "topActions": [
    { "title": <string>, "description": <string>, "dollarImpact": <string> },
    { "title": <string>, "description": <string>, "dollarImpact": <string> },
    { "title": <string>, "description": <string>, "dollarImpact": <string> }
  ],
  "infrastructureGuidance": {
    "<key>": { "title": <string>, "steps": [<string>, ...] }
  }
}

INFRASTRUCTURE GUIDANCE RULES:
- Only include entries for "No" answers.
- Use ONLY these exact key names (no others):
    "googleProfile"     — missing Google Business Profile
    "llc"               — not registered as an LLC or business entity
    "insurance"         — lacking general liability insurance
    "businessBank"      — lacking a separate business bank account
    "mileage"           — not tracking business mileage
    "quarterlyTaxes"    — not setting aside quarterly taxes
    "serviceAgreement"  — lacking a written service agreement
    "reviewCollection"  — lacking a review collection system
- Do NOT mention specific third-party brand names in steps (no insurance companies, banks, LLC services, or mileage apps by name). Keep steps generic and action-focused — the platform surfaces partner resources separately.
- For the "mileage" key: focus steps on the IRS standard mileage rate, the tax deduction dollar value based on the business data, and why consistent daily logging matters. Reference "NWI Suite Labor Watch" as the recommended tool for automated mileage tracking.`;

function buildFallback() {
  return {
    businessHealthScore: 0,
    subscores: {
      financialHealth: 0,
      pricing: 0,
      googlePresence: 0,
      businessFoundation: 0,
      revenueEfficiency: 0,
    },
    topActions: [
      {
        title: "Analysis unavailable",
        description: "We were unable to generate your analysis. Please try again.",
        dollarImpact: "—",
      },
    ],
    infrastructureGuidance: {},
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier1, tier2 } = body;

    const userMessage = `Analyze this mobile service business and return JSON only:

TIER 1 — FINANCIAL DATA:
- Trade: ${tier1.trade || "Not specified"}
- Monthly Revenue: $${tier1.monthlyRevenue}
- Jobs Per Month: ${tier1.jobsPerMonth}
- Most Common Service: ${tier1.topService}
- Price for That Service: $${tier1.servicePrice}
- Monthly Expenses: $${tier1.monthlyExpenses}
- Hours Per Day: ${tier1.hoursPerDay}
- Hourly Labor Rate: $${tier1.laborRate}

TIER 2 — BUSINESS FOUNDATION:
- Has Google Business Profile: ${tier2.hasGBP ? "Yes" : "No"}
${tier2.hasGBP && tier2.starRating ? `- Google Star Rating: ${tier2.starRating} stars` : ""}
- Registered LLC/Entity: ${tier2.isLLC ? "Yes" : "No"}
- Has General Liability Insurance: ${tier2.hasInsurance ? "Yes" : "No"}
- Has Separate Business Bank Account: ${tier2.hasBusinessBank ? "Yes" : "No"}
- Tracks Business Mileage: ${tier2.tracksMileage ? "Yes" : "No"}
- Sets Aside Quarterly Taxes: ${tier2.setsAsideTaxes ? "Yes" : "No"}
- Has Written Service Agreement: ${tier2.hasServiceAgreement ? "Yes" : "No"}
- Has Review Collection System: ${tier2.collectsReviews ? "Yes" : "No"}

Calculate specific dollar amounts for every insight based on the actual numbers above. For infrastructureGuidance, only include entries for "No" answers with actionable step-by-step instructions.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    console.log("[analyze] Raw Anthropic response text:", content.text);

    try {
      const cleaned = content.text.replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/```\s*$/,'').trim()
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch (parseErr) {
      console.error("[analyze] JSON parse failed:", parseErr, "Raw text:", content.text);
      return NextResponse.json(buildFallback());
    }
  } catch (err) {
    console.error("[analyze] Analyze error:", err);
    return NextResponse.json(buildFallback());
  }
}
