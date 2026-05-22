import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobile Service Coach",
  description: "Free AI business analysis for mobile service professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
