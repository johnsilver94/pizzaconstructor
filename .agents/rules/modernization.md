# Agent Operating Rules & Modernization Standards

## 1. Operating Protocol
- **Strictly adhere to the workflow in [AGENTS.md](file:///c:/Users/cretu/Desktop/pizzaconstructor/AGENTS.md).**
- **ZenHub Tasks**: Always create detailed, high-effort work items with complete acceptance criteria and assign them to `johnsilver94` upon starting.
- **Branches**: Create on GitHub first / push tracking branch immediately before development.
- **Commits**: Never commit without presenting the diff and getting explicit confirmation from the user.
- **Pull Requests**: Open PR targeting `dev` with `Closes #<issue_number>`, monitor CI checks, and **never merge automatically**. Merging is strictly reserved for the user.
- **Move to Done**: Only move the ZenHub issue to Done after the user confirms the PR merge.

## 2. Technical Standards
- **TypeScript**: Strict mode enabled. No implicit `any`. All API boundaries validated with `zod`.
- **Styling & UI**: Modern, accessible (WAI-ARIA), mobile-responsive, dynamic micro-interactions.
- **State & Real-time**: Robust error boundaries, optimistic updates where appropriate, and clean disconnection handling for collaborative sessions.
