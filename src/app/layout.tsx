import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import "./globals.css";

// 🎨 Fonts Setup
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// 🌐 STEP 3: GOOGLE METADATA & VERIFICATION ENGINE
export const metadata: Metadata = {
  title: "AfruzStore | Premium AI Courses & Digital Assets",
  description:
    "Master high-value tech skills, AI prompts, and token architectures directly on AfruzStore.",
  keywords: [
    "AfruzStore",
    "Afruz Store",
    "AI Prompt Engineering",
    "Token Mastery",
    "Tech Courses",
  ],
  authors: [{ name: "Afruz" }],
  creator: "Afruz",
  publisher: "AfruzStore",
  
  // 🎯 GOOGLE SEARCH CONSOLE VERIFICATION TAG
  verification: {
    google: "RuLzBOP5GBUIKXfBSvCv0v1CAsFFtKGH6x1Tk1RP2I8", // 👈 Search console se mila 'content' code yahan paste kar do
  },

  // 📱 Social Media OpenGraph Cards
  openGraph: {
    title: "AfruzStore | Premium AI Courses & Digital Assets",
    description:
      "Master high-value tech skills, AI prompts, and token architectures directly on AfruzStore.",
    url: "https://afruzstore.vercel.app",
    siteName: "AfruzStore",
    type: "website",
    locale: "en_US",
  },
  
  // 🤖 Robots Configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-[#030303] text-slate-100 antialiased selection:bg-violet-500/30 selection:text-white">
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            {/* Background Ambient Glow Gradient */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent blur-3xl" />
            
            {/* Main Application Container */}
            <main className="relative z-10 flex-1">{children}</main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
