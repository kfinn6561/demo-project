/**
 * Root layout for the chess game application
 */

import type { Metadata } from "next";
import ErrorBoundary from "../components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Game - Play Chess Online",
  description: "A web-based chess game for two players. Play chess with full rule support including castling, en passant, and pawn promotion.",
  keywords: ["chess", "chess game", "online chess", "two player chess"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♔</text></svg>" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
