import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "AfruzStore | Premium AI Courses & Digital Assets",
  description: "Master high-value tech skills, AI prompts, and token architectures directly on AfruzStore.",
  keywords: ["AfruzStore", "Afruz Store", "AI Prompt Engineering", "Token Mastery"],
  authors: [{ name: "Afruz" }],
  creator: "Afruz",
  publisher: "AfruzStore",
  openGraph: {
    title: "AfruzStore | Premium AI Courses & Digital Assets",
    description: "Master high-value tech skills, AI prompts, and token architectures directly on AfruzStore.",
    url: "https://afruzstore.vercel.app",
    siteName: "AfruzStore",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        {/* 🎯 DIRECT HARDCODED GOOGLE VERIFICATION META TAG */}
        <meta name="google-site-verification" content="RuLzBOP5GBUIKXfBSvCv0v1CAsFFtKGH6x1Tk1RP2I8" />
      </head>
      <body className="min-h-screen bg-[#030303] text-slate-100 antialiased selection:bg-violet-500/30 selection:text-white">
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent blur-3xl" />
            <main className="relative z-10 flex-1">{children}</main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
