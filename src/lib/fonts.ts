import { Poppins, Pacifico, JetBrains_Mono } from "next/font/google";

// ============================================
// Font Configuration
// ============================================

/**
 * Poppins - Primary sans-serif font for UI and body text
 * Clean, modern, friendly - perfect for a bakery brand
 */
export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

/**
 * Pacifico - Script font for display/headings
 * Playful, friendly script for logo-like elements
 */
export const pacifico = Pacifico({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400"],
});

/**
 * JetBrains Mono - Monospace font for code blocks
 * Supports: Latin, Latin Extended, Cyrillic, Greek, Vietnamese
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});
