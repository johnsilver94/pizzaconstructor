import * as React from "react";
import { PIZZA_SIZES } from "@pizzaconstructor/shared";
import { colors } from "@pizzaconstructor/theme";
import { Button, Badge } from "@pizzaconstructor/ui";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.slate.darker,
        color: colors.slate.surface,
        fontFamily: "Inter, sans-serif",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <Badge variant="primary">Monorepo Active</Badge>
        <h1
          style={{
            fontSize: "2.5rem",
            color: colors.primary.DEFAULT,
            margin: "1rem 0",
          }}
        >
          🍕 PizzaConstructor
        </h1>
        <p style={{ color: colors.slate.muted, marginBottom: "2rem" }}>
          Modernized with Bun, Turborepo, Next.js 15 & ElysiaJS.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Button variant="primary">
            Launch Pizza Builder ({Object.keys(PIZZA_SIZES).length} Sizes)
          </Button>
          <Button variant="outline">Group Orders</Button>
        </div>
      </div>
    </main>
  );
}
