import { edenTreaty } from "@elysiajs/eden";
import type { App } from "@pizzaconstructor/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? "http://localhost:3001"
    : "http://127.0.0.1:3001");

export type EdenClient = ReturnType<typeof edenTreaty<App>>;

export const api: EdenClient = edenTreaty<App>(API_URL);
