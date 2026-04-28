import type { Metadata } from "next";
import { Anton, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MiniaPulse — Studio IA de miniatures YouTube",
  description:
    "Miniatures niveau agence, en 60 secondes, avec ta tronche. Persona récurrent verrouillé. Styles signature mesurés au CTR.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="bg-ink-950">
      <body
        className={`${anton.variable} ${interTight.variable} ${jetbrains.variable} font-sans antialiased bg-ink-950 text-white/90`}
      >
        {children}
      </body>
    </html>
  );
}
