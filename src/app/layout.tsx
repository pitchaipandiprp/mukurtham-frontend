import type { Metadata } from "next";
import AppHeader from "@/components/layout/app-header";
import AppFooter from "@/components/layout/app-footer";
import { Poppins } from "next/font/google";
import "./globals.css";
import "../assets/css/custom.css";
import MobileBottomNav from "@/components/layout/main/mobile-bottom-nav";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mukurtham",
  description: "A modern frontend layout with a reusable header, footer, and dynamic content area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${poppins.variable}`}>
      <body className="min-h-full bg-gray-100 text-gray-800 antialiased">
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
