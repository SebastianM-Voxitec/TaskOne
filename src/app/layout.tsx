import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

// Proto Mono–style monospace: Space Mono (Proto Mono not on Google Fonts)
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Voxitec",
  description: "Voxitec – innovating the digital sphere",
};

// Responsive viewport; allow zoom (no maximumScale) so zoom in/out works and layout scales
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Do not set maximumScale or userScalable: false — user zoom must work
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} bg-surface text-white antialiased`}>
      <body className="min-h-screen font-mono">{children}</body>
    </html>
  );
}
