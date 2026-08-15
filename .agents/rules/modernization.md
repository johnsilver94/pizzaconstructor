# PizzaConstructor — Agent Operating Rules & Standards

## 1. Operating Protocol & Workflow Contract
- **Task Quality & Assignment**: Every ZenHub task must be detailed with high effort (Context & Goal, Scope, Acceptance Criteria, Verification steps, Technical Notes), assigned to `johnsilver94`, organized into Epics, and set to `In Progress` before coding.
- **GitHub-First Branch Creation**: Create remote branch on GitHub first from `origin/dev` before checking out locally (`git push origin origin/dev:refs/heads/feat/issue-<num>-<slug>`).
- **User Commit Confirmation**: NEVER commit without presenting `git status` and staged diff summary to the user and obtaining explicit confirmation.
- **Agent Directly Creates PR**: Once changes are committed and pushed, the agent automatically creates the PR targeting `dev` on GitHub with connected issue (`Closes #<num>`) and structured verification report.
- **CI Checks & User-Only Merge**: The agent must monitor PR/CI checks until green, and **NEVER merge the PR**. Only the user can merge pull requests.
- **Completion**: Move ZenHub issue to `Done` only after the user confirms the PR merge into `dev`.

## 2. Technical Standards
- **TypeScript**: Strict mode enabled. No implicit `any`. All API boundaries validated with `zod` or `TypeBox`.
- **Styling & UI**: Modern, accessible (WAI-ARIA), mobile-responsive, dynamic micro-interactions.
- **State & Real-time**: Robust error boundaries, optimistic updates where appropriate, and clean disconnection handling for collaborative sessions.
