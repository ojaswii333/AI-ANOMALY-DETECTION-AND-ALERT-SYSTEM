import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Preloader from "../components/Preloader";
import CustomCursor from "../components/CustomCursor";
import { Suspense } from "react";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Anomaly Detection | Intelligent Alert System",
  description: "Advanced machine learning system for real-time anomaly detection in sensor telemetry.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${jakarta.variable} antialiased selection:bg-primary/30 selection:text-primary custom-cursor-none`}>
        <Preloader />
        <CustomCursor />

        <div className="relative min-h-screen bg-obsidian text-text-main overflow-x-hidden">
          {/* Universal Background Effects */}
          <div className="bg-grid fixed inset-0 opacity-10 pointer-events-none" />
          <div className="mesh-gradient fixed inset-0 pointer-events-none opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

          <Navbar />
          <main className="relative z-10">
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </body>
    </html>
  );
}
