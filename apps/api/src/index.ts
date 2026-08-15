import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { healthRoute } from "./routes/health";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

export const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    })
  )
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "🍕 PizzaConstructor API",
          version: "2.0.0",
          description:
            "High-performance REST & Real-time WebSocket API powered by ElysiaJS and Bun runtime for custom pizza building and collaborative group orders.",
        },
        tags: [
          { name: "Health & System", description: "Health checks and operational diagnostics" },
          { name: "Catalog", description: "Product catalog and ingredients" },
          { name: "Constructor", description: "Interactive custom pizza calculation engine" },
          { name: "Group Orders", description: "Real-time collaborative order room sessions" },
        ],
      },
    })
  )
  .use(healthRoute)
  .get("/", () => ({
    message: "🍕 Welcome to PizzaConstructor API Service",
    documentation: "/swagger",
    healthCheck: "/health",
    version: "2.0.0",
  }))
  .listen(PORT);

console.log(
  `🍕 PizzaConstructor API is running at http://${app.server?.hostname}:${app.server?.port} (Swagger docs: http://localhost:${PORT}/swagger)`
);

export type App = typeof app;
