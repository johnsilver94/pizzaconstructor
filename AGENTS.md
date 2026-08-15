# PizzaConstructor — AI Developer Guidelines & Operating Contract (AGENTS.md)

Welcome to **PizzaConstructor**, a web application that enables users to visually construct custom pizza recipes and organize collaborative group orders with friends and colleagues.

This document serves as the repository-wide operating contract and persistent memory for AI coding assistants and developers. More specific `AGENTS.md` or rule files may add localized guidelines, but must not weaken the safety, review, or workflow protocols defined here.

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
The current codebase in this repository is a Node.js prototype:
- **Runtime**: Node.js / Express
- **Templating & Frontend**: EJS, jQuery, Bootstrap 4, Gulp, SCSS
- **Database**: MongoDB with Mongoose (`models/product.js`, `models/user.js`)
- **Assets**: Gulp pipeline (`gulpfile.js`, `_source/`, `dev/`)

> [!NOTE]
> Treat legacy code (`app.js`, `routes/`, `views/`, `dev/`, `models/`) as business logic and design references. Do not build new features on top of obsolete libraries (e.g., jQuery, Gulp, Express EJS).

### 2.2 Modernization Vision & Target Stack
Modernization targets a state-of-the-art, high-performance, type-safe stack:
- **Language**: TypeScript (strict mode)
- **Frontend Framework**: Next.js (App Router) or Vite + React
- **Styling & UI**: Modern CSS / TailwindCSS / Radix UI / Shadcn / Framer Motion for smooth micro-animations and interactive pizza builder
- **State Management & Data Fetching**: Zustand / TanStack Query (React Query)
- **Real-time / Group Orders**: WebSockets / Server-Sent Events (SSE) or Supabase Realtime / Liveblocks
- **Backend / API**: Next.js Route Handlers / Server Actions / tRPC or modern Express/Fastify TypeScript backend
- **Database / ORM**: MongoDB / PostgreSQL with Prisma, Drizzle ORM, or Mongoose 8+
- **Testing**: Vitest / Jest, Playwright / Cypress for end-to-end user flows

---

## 3. Instruction Priority

1. Follow explicit system and user instructions.
2. Follow this root `AGENTS.md` guide.
3. Follow the nearest scoped `AGENTS.md` or `.agents/rules/` for files being changed.
4. Follow the linked work item's acceptance criteria and documented architecture decisions.

When instructions conflict or required access is missing, stop and report the conflict instead of silently bypassing it.

---

## 4. Required Work-Item & Development Workflow

Apply this strict workflow to every implementation task in this repository:

### Step 1: Work Item Creation & Organization (ZenHub)
1. **Search First**: Before changing code, use the ZenHub MCP to search for existing work items to prevent duplicates.
2. **Quality Work Items with Effort**: If creating new work items, write detailed, high-effort descriptions including:
   - **Context & Goal**
   - **Detailed Scope of Changes**
   - **Acceptance Criteria (Checklist)**
   - **Verification / Testing Steps**
   - **Dependencies / Technical Notes**
3. **Epics Organization**: Group related tasks under Epics when tackling multi-part features (e.g., Epic: Interactive Pizza Constructor, Epic: Collaborative Group Orders).
4. **Assign & Move**: Assign the work item to the authenticated user (`johnsilver94`) and move it to **In Progress** in ZenHub before making any file changes.

### Step 2: Remote Branch Creation
1. Update remote refs (`git fetch origin`).
2. Create the branch on GitHub first (or create and push tracking branch immediately from the latest `origin/dev`, which is the canonical base).
3. Branch naming convention: `feat/issue-<number>-<slug>` or `fix/issue-<number>-<slug>`.
4. Check out the branch locally to begin development.

### Step 3: Scoped Implementation & Local Validation
1. Implement only the linked scope. Do not disturb unrelated files or untracked changes.
2. Run focused validation and automated tests while working.
3. For UI changes, verify desktop and mobile responsive states.

### Step 4: User Commit Review & Approval (Mandatory)
1. **Inspect Staged Diff**: Inspect `git status` and staged diffs. Ensure no unrelated files, credentials, or build artifacts are included.
2. **Request Confirmation**: Before executing any `git commit`, present a concise summary and diff to the user, and wait for explicit confirmation that they approve the changes.
3. **Conventional Commits**: Format commit messages following Conventional Commits:
   - Format: `<type>(<scope>): <lower-case description> (#<issue_number>)`
   - Allowed types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `ci`, `build`, `test`, `perf`
   - Allowed scopes: `constructor`, `menu`, `cart`, `grouporder`, `auth`, `ui`, `api`, `db`, `deps`, `config`

### Step 5: Pull Request & Issue Connection
1. Fetch `origin/dev` and resolve any divergence cleanly.
2. Push all commits to the remote task branch.
3. Open a Pull Request targeting the `dev` branch.
4. In the PR body, link the ZenHub issue (`Closes #<issue_number>` or `Fixes #<issue_number>`), and provide a structured PR description:
   - **Summary of Changes**
   - **Connected Work Item**
   - **Verification & Test Results**
   - **Screenshots / Visual Notes (for UI)**

### Step 6: PR Checks & Merging Protocol
1. **Monitor Checks**: Monitor all CI/PR checks until they pass. If any check fails, resolve it on the task branch, push updates, and continue monitoring.
2. **USER-ONLY MERGE**: The agent must **NEVER** merge a pull request or merge directly into `dev`/`master`. **Only the user can merge pull requests.**
3. Report to the user that the PR is ready and waiting for their review and merge.

### Step 7: Post-Merge Completion
1. Once the user confirms the PR is merged into `dev`, move the ZenHub work item to **Done**.
2. Synchronize local `dev` branch (`git checkout dev && git pull origin dev`) and safely clean up the local task branch.

---

## 5. Engineering Boundaries & Code Standards

- **TypeScript First**: Strict mode enabled. No implicit `any`. All API boundaries validated with `zod`.
- **Modularity & Separation of Concerns**: Keep UI components, business logic (hooks/stores), and data fetching clearly decoupled.
- **Secrets & Data Safety**:
  - Never commit tokens, passwords, database credentials, or real `.env` files.
  - Never run destructive database drops or resets on unverified environments.
- **UI & Visual Excellence**:
  - Polished, responsive, accessible (WAI-ARIA).
  - High-contrast accessible color palette with signature golden accents (`#f39c12` / `#e67e22`) and dark slate (`#2c3e50`).
  - Fluid micro-animations for interactive pizza builder layers and cart interactions.

---

## 6. Definition of Done

A work item is complete only when:
1. All acceptance criteria are met and tested.
2. Automated and manual validations pass with zero regressions.
3. Staged changes were reviewed and approved by the user prior to commit.
4. A Pull Request targeting `dev` is opened with linked issue `#XX`.
5. All PR CI checks pass.
6. The user explicitly reviews and merges the Pull Request into `dev`.
7. The ZenHub work item is moved to **Done**.
