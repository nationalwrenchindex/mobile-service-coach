import { NextRequest, NextResponse } from "next/server";

const SUBSCORE_LABELS: Record<string, string> = {
  financialHealth: "Financial Health",
  pricing: "Pricing vs Market",
  googlePresence: "Google Presence",
  businessFoundation: "Business Foundation",
  revenueEfficiency: "Revenue Efficiency",
};

function scoreColor(val: number) {
  if (val < 50) return "#f87171";
  if (val < 70) return "#fbbf24";
  return "#00B4D8";
}

function buildHtml(analysis: Record<string, unknown>): string {
  const score = analysis.businessHealthScore as number;
  const subscores = analysis.subscores as Record<string, number>;
  const topActions = analysis.topActions as Array<{ title: string; description: string; dollarImpact: string }>;
  const guidance = analysis.infrastructureGuidance as Record<string, { title: string; steps: string[] }>;

  const subscoreRows = Object.entries(subscores)
    .map(([key, val]) => `
      <tr>
        <td style="padding:8px 0;color:#8BAABB;font-size:14px;">${SUBSCORE_LABELS[key] || key}</td>
        <td style="padding:8px 0;text-align:right;font-weight:bold;color:${scoreColor(val)};font-size:14px;">${val}/100</td>
      </tr>`)
    .join("");

  const actionItems = topActions
    .map((a, i) => `
      <div style="background:#112236;border:1px solid #1e3a52;border-radius:12px;padding:16px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
          <strong style="color:#e8f0f5;font-size:14px;">${i + 1}. ${a.title}</strong>
          <span style="color:#00B4D8;font-weight:bold;font-size:14px;white-space:nowrap;">${a.dollarImpact}</span>
        </div>
        <p style="color:#8BAABB;font-size:13px;margin:8px 0 0;">${a.description}</p>
      </div>`)
    .join("");

  const guidanceSection = guidance && Object.keys(guidance).length > 0
    ? `<h2 style="font-family:sans-serif;color:#e8f0f5;font-size:18px;margin:32px 0 16px;">Action Steps for Gaps</h2>
      ${Object.entries(guidance).map(([, item]) => `
        <div style="background:#112236;border:1px solid #1e3a52;border-radius:12px;padding:16px;margin-bottom:12px;">
          <strong style="color:#00B4D8;font-size:14px;">${item.title}</strong>
          <ol style="color:#8BAABB;font-size:13px;margin:10px 0 0;padding-left:18px;">
            ${item.steps.map((s) => `<li style="margin-bottom:6px;">${s}</li>`).join("")}
          </ol>
        </div>`).join("")}`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#080E14;margin:0;padding:20px;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="text-align:center;padding:32px 0 24px;">
      <h1 style="color:#00B4D8;font-family:sans-serif;font-size:24px;margin:0 0 8px;">Mobile Service Coach</h1>
      <p style="color:#8BAABB;font-size:14px;margin:0;">Your Business Health Report</p>
    </div>

    <div style="background:#0D1B2A;border:1px solid #1e3a52;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
      <div style="font-size:64px;font-weight:800;color:#00B4D8;font-family:sans-serif;line-height:1;">${score}</div>
      <div style="color:#8BAABB;font-size:14px;margin-top:4px;">Business Health Score / 100</div>
    </div>

    <div style="background:#0D1B2A;border:1px solid #1e3a52;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h2 style="font-family:sans-serif;color:#e8f0f5;font-size:16px;margin:0 0 16px;">Score Breakdown</h2>
      <table style="width:100%;border-collapse:collapse;">${subscoreRows}</table>
    </div>

    <h2 style="font-family:sans-serif;color:#e8f0f5;font-size:18px;margin:0 0 16px;">Top 3 Action Items</h2>
    ${actionItems}

    ${guidanceSection}

    <div style="background:#112236;border:1px solid #1e3a52;border-radius:16px;padding:24px;text-align:center;margin-top:32px;">
      <h2 style="font-family:sans-serif;color:#e8f0f5;font-size:18px;margin:0 0 8px;">Ready to automate everything?</h2>
      <p style="color:#8BAABB;font-size:13px;margin:0 0 16px;">The National Wrench Index Suite handles it all — built for mobile service pros.</p>
      <a href="https://nationalwrenchindex.com/Suite" style="display:inline-block;background:#00B4D8;color:#080E14;padding:14px 28px;border-radius:10px;font-weight:bold;text-decoration:none;font-size:14px;">Explore the Suite →</a>
    </div>

    <p style="text-align:center;color:#1e3a52;font-size:12px;margin-top:32px;">
      © ${new Date().getFullYear()} Mobile Service Coach. A National Wrench Index LLC product.
    </p>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, analysis } = await req.json();

    if (!email || !analysis) {
      return NextResponse.json({ error: "Missing email or analysis" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const html = buildHtml(analysis);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mobile Service Coach <coach@mobileservicecoach.com>",
        to: [email],
        subject: "Your Mobile Business Health Report",
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send report error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
