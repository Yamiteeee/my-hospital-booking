import type { Metadata } from "next";
import "./globals.css";
import { MockStoreProvider } from "@/providers/mock-store";

export const metadata: Metadata = {
  title: "St. Mary's Hospital Booking Desk",
  description: "Next-gen conversational intake and management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MockStoreProvider>
          {children}
        </MockStoreProvider>
      </body>
    </html>
  );
}