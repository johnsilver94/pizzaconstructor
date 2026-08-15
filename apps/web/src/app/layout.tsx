import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PizzaConstructor — Custom Pizza Builder & Collaborative Group Orders",
  description: "Craft your dream pizza with real-time allergen & price calculation and order together with friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
