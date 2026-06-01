import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Humara naya Command Center!

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WAR Project",
  description: "Elite Study Tracking Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-200`}>
        {/* Ye Navbar ab har page ke upar fix rahega */}
        <Navbar />
        
        {/* Ye line ke aage tumhara main page content load hoga */}
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}