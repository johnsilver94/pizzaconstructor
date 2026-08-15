# Modernization & Code Quality Rules

## 1. Codebase Transition Rules
- **Do not modify legacy files directly unless specifically asked to patch or test legacy code.**
- Place all modernized application code in a clean, designated structure (e.g. Next.js app or `src/` modular structure).
- Extract domain logic and data structures from legacy files (`models/`, `routes/`, `mocks.js`) into type-safe TypeScript models/schemas.

## 2. Technical Standards
- **TypeScript**: Strict mode enabled. No implicit `any`. All API inputs/outputs validated with `zod`.
- **Styling & UI**: Modern, accessible (WAI-ARIA), mobile-responsive, dynamic micro-interactions (pizza constructor canvas/SVG, animated cart counters, real-time participant badges).
- **State & Real-time**: Group order state must handle concurrent updates, disconnections, and host lock/finalize actions gracefully.
- **Testing**: Write unit tests for business logic (price calculators, recipe modifiers, allergen checks) and E2E tests for core flows (constructor -> cart -> checkout, group order flow).
