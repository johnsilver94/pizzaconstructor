# PizzaConstructor — AI Developer Guidelines & Project Knowledge (AGENTS.md)

Welcome to **PizzaConstructor**, a web application that enables users to visually construct custom pizza recipes and organize collaborative group orders with friends and colleagues.

This document serves as the persistent memory and operational guideline for AI coding assistants and developers collaborating on the modernization of this repository.

---

## 1. Project Overview & Core Domain

### 1.1 Core Mission
The primary goal of PizzaConstructor is to provide an intuitive, delightful food ordering experience with two marquee features:
1. **Interactive Pizza Constructor**: Visual, step-by-step pizza creator allowing customization of dough/crust, sauces, cheeses, meats, veggies, and toppings, with real-time price, weight, and allergen calculation.
2. **Collaborative Group Ordering**: Group order sessions where a host creates an order room with a deadline, shares an invitation link with colleagues/friends (guests or registered), aggregates cart items, and places a unified order.

### 1.2 User Actors & Permissions
- **Unregistered Guest**: Browse menu, view promotions, use interactive constructor in preview mode, join group orders via shared invite link.
- **Registered User**: Create/save custom pizza recipes, track order history, manage profile, create and manage group orders, save favorite items.
- **Group Order Host (Admin)**: Create group order room, set deadline/time window, invite participants, view live participant carts, modify/approve items, place final checkout.
- **Group Order Participant**: Join via invite link, customize pizzas or select menu items, add to group cart under their name.

### 1.3 Key Functional Domains
- `Constructor`: Dough selection (size, thickness, crust type), sauce selection, layered topping picker, calorie/weight/price estimation, visual layered preview.
- `Catalog & Menu`: Pizzas, Salads, Desserts, Drinks, Vegan options, allergen badges, nutritional info.
- `Group Orders`: Session tokens/slugs, participant management, timer/countdown, status flow (`open` -> `locked` -> `submitted` -> `completed`).
- `Cart & Checkout`: Standalone cart, group cart synchronization, order placement, discount/promotions calculation.
- `User & Auth`: Authentication, user profiles, saved recipes collection, previous orders.

---

## 2. Codebase Evolution: Legacy vs. Modernization

### 2.1 Legacy Architecture (Reference Only)
The current codebase in this repository is a legacy Node.js prototype:
- **Runtime**: Node.js (v8 era) / Express 4
- **Templating & Frontend**: EJS, jQuery, Bootstrap 4, Gulp, SCSS
- **Database**: MongoDB with Mongoose 5 (`models/product.js`, `models/user.js`)
- **Assets**: Gulp pipeline (`gulpfile.js`, `_source/`, `dev/`)

> [!NOTE]
> Treat legacy code (`app.js`, `routes/`, `views/`, `dev/`, `models/`) as business logic and design references. Do not build new features on top of obsolete libraries (e.g., jQuery, Gulp, Express EJS).

### 2.2 Modernization Vision & Target Stack
Modernization targets a state-of-the-art, high-performance, type-safe stack:
- **Language**: TypeScript (strict mode)
- **Frontend Framework**: Next.js (App Router) or Vite + React
- **Styling & UI**: Modern CSS / TailwindCSS / Radix UI / Shadcn / Framer Motion for smooth micro-animations and interactive pizza builder
- **State Management & Data Fetching**: Zustand / Redux Toolkit / TanStack Query (React Query)
- **Real-time / Group Orders**: WebSockets / Server-Sent Events (SSE) or Supabase Realtime / Liveblocks
- **Backend / API**: Next.js Route Handlers / Server Actions / tRPC or modern Express/Fastify/NestJS TypeScript backend
- **Database / ORM**: PostgreSQL / MongoDB with Prisma or Drizzle ORM / Mongoose 8+
- **Testing**: Vitest / Jest, Playwright / Cypress for end-to-end user flows

---

## 3. Engineering & Development Guidelines

### 3.1 Code Style & Conventions
- **TypeScript First**: All new code must be strictly typed. Avoid `any`; use well-defined interfaces and zod schemas for validation.
- **Component Architecture**: Atomic, modular, and accessible (WAI-ARIA compliant). Keep business logic in custom hooks and state stores, separating UI presentation from data fetching.
- **Design & Aesthetics**:
  - Deliver visually impressive, polished, responsive UI (desktop & mobile first).
  - Use high-contrast, accessible palettes (Golden accent `#f39c12` / `#e67e22`, Dark slate `#2c3e50`, Warm neutrals).
  - Smooth interactive transitions for pizza topping placement and live pricing updates.
- **Documentation**: Provide clear comments for non-trivial domain logic (e.g., pricing formulas, allergen conflict detection, group order locking mechanisms).

### 3.2 Safety & Verification
- Prioritize incremental, testable milestones.
- Ensure every feature has automated tests (unit tests for calculation logic, integration tests for API endpoints/flows).
- Validate environment variables with strict schemas (e.g., Zod env validation).

---

## 4. Workflows for AI Assistant

When working on tasks in this repository:
1. **Explore & Reference**: Review legacy business logic in `routes/`, `models/`, and `README.md` to preserve essential domain behaviors during migration.
2. **Modular Plan**: Present clear multi-step plans before making major architectural changes.
3. **Verify**: Test functionality and maintain clean commits and documentation.
