/**
 * Root layout for the chess game application
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Game",
  description: "A web-based chess game for two players",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
