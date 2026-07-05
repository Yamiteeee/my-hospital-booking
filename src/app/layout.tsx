import type { Metadata } from "next";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { RefineGlobalProvider } from "@/providers/RefineGlobalProvider"; // Import Refine
import "./globals.css";

export const metadata: Metadata = {
  title: "St. Mary's MedVA Portal",
  description: "Modern patient care coordination framework",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50">
        <SmoothScrollProvider>
          {/* Wrap children globally so every route has access to Refine database hooks */}
          <RefineGlobalProvider>
            {children}
          </RefineGlobalProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}