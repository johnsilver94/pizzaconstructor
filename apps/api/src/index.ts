import { PIZZA_SIZES } from "@pizzaconstructor/shared";
import { colors } from "@pizzaconstructor/theme";

const server = Bun.serve({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        theme: colors.primary.DEFAULT,
        sizesCount: Object.keys(PIZZA_SIZES).length,
        timestamp: new Date().toISOString(),
      });
    }
    return new Response("PizzaConstructor API Service");
  },
});

console.log(`🍕 PizzaConstructor API running on http://localhost:${server.port}`);
