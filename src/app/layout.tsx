import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import Header from "@/components/header"; // FIXED: Removed curly braces for default import
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AfruzStore — Master AI. Spend Less. Build More.",
  description:
    "Premium courses that teach you to use Claude with fewer tokens, build AI for good, and turn AI skills into real income.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 🌐 FIXED: Added bg-[#030303] directly to HTML and Body tags to wipe out white spaces
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} bg-[#030303]`}>
      <body className="min-h-screen antialiased bg-[#030303] text-slate-100">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="bg-[#030303]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
