import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MediaMirror — News Bias Detector",
  description:
    "See how 6 Indian news outlets cover the same story differently. AI-powered bias analysis.",
  openGraph: {
    title: "MediaMirror — News Bias Detector",
    description:
      "AI-powered tool that shows how Indian media frames the same story differently.",
    url: "https://mediamirror.vercel.app",
    siteName: "MediaMirror",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
