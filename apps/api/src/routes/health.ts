import { Elysia, t } from "elysia";
import { PIZZA_SIZES, DOUGH_TYPES, CATEGORIES } from "@pizzaconstructor/shared";
import { colors } from "@pizzaconstructor/theme";

export const healthRoute = new Elysia({ prefix: "/health" }).get(
  "/",
  () => {
    return {
      status: "ok" as const,
      service: "pizzaconstructor-api",
      version: "2.0.0",
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "development",
      theme: {
        primaryColor: colors.primary.DEFAULT,
        slateColor: colors.slate.DEFAULT,
      },
      stats: {
        sizesCount: Object.keys(PIZZA_SIZES).length,
        doughTypesCount: Object.keys(DOUGH_TYPES).length,
        categoriesCount: CATEGORIES.length,
      },
    };
  },
  {
    response: t.Object({
      status: t.Literal("ok"),
      service: t.String(),
      version: t.String(),
      uptimeSeconds: t.Number(),
      timestamp: t.String(),
      environment: t.String(),
      theme: t.Object({
        primaryColor: t.String(),
        slateColor: t.String(),
      }),
      stats: t.Object({
        sizesCount: t.Number(),
        doughTypesCount: t.Number(),
        categoriesCount: t.Number(),
      }),
    }),
    detail: {
      tags: ["Health & System"],
      summary: "System health check",
      description: "Returns service uptime, operational health, and domain readiness stats.",
    },
  }
);
