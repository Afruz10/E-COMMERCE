"use client";

import React from "react";

export default function InstagramIcon() {
  return (
    <a 
      href="https://instagram.com/afrux.exe" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 animate-pulse"
      title="Follow Afruz on Instagram"
    >
      {/* Dynamic Instagram SVG Vector Icon with Correct Strict Closing Tags */}
      <svg 
        className="h-7 w-7 text-white" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </a>
  );
}
