# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in repositories.

## Development Commands

- `npm run dev` - Start development server with Turbopack 
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run prepare` - Set up Husky pre-commit hooks

## Architecture Overview

This is a Next.js 15 application. The app uses:

- **Authentication**: Supabase Auth for user authentication with email/password and OAuth providers 
- **Database**: Supabase as the primary database with integrated authentication
- **UI Framework**: Tailwind CSS with Radix UI components and custom components in `/src/components/ui`
- **State Management**: Server-side rendering with Next.js App Router + custom Auth Context
- **Testing**: Jest with React Testing Library

### Key Architecture Patterns

**Database Integration**: The app maintains user records in Supabase's `users` table keyed by Supabase Auth user ID. User creation happens automatically via `userDb.upsertUser()` during authentication.

**Authentication Flow**: Supabase Auth middleware protects routes. Dashboard pages require authentication and redirect to `/auth/sign-in` if not authenticated.

**Auth Implementation**:
- Custom auth utilities in `/src/lib/auth.ts` and `/src/lib/auth-server.ts` 
- Auth context provider in `/src/hooks/useAuth.tsx`
- Custom sign-in/up pages at `/auth/sign-in` and `/auth/sign-up`  
- OAuth callback handler at `/auth/callback`

**API Structure**:
- `/api/*` - API routes for various entities and operations

**Component Architecture**: Uses composition pattern with reusable UI components. 

### Directory Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components  
- `/src/lib` - Utility functions and external service clients
- `/src/generated/prisma` - Generated Prisma client files (note: multiple copies present)

### Environment Configuration 

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)

Optional environment variables for OAuth:  
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (for Google sign-in)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Note**: OAuth providers must also be configured in your Supabase dashboard under Authentication > Settings > Auth Providers.

### Build Configuration

Next.js is configured to ignore TypeScript and ESLint errors during builds (see next.config.ts). Images are configured to allow all remote domains for flexibility.

### Testing Setup 

Jest configured with jsdom environment, Babel transformation for Next.js, and module path mapping for @ imports. Tests located in `/src/__tests__/`.

## Claude Prompting Rules

- **Maximize attention with keyword anchors**
  - When prompt length is high or context may be truncated:
    - Prepend with **"think hard"** or **"ultrathink"**.
    - Append with **"think step by step..."** to improve token retention.
  
- **Prioritize tokens by placement**
  - Place all context (app background, user roles, product goals, limitations) at the **beginning** of the prompt.
  - Place all task instructions at the **end** of the prompt.

- **Avoid generic role interpretation**
  - When given a role (e.g., "senior engineer"): 
    - Override with explicit instructions.
      - Define responsibilities.
      - Specify tasks.
      - Outline expected outputs.
    - Ignore vague role titles unless detailed behavior is defined.
  
- **Pre-task decomposition**
  - Before starting any task longer than 100 tokens or involving implementation:
    - Pause and output a breakdown of atomic subtasks as a checklist.
    - Use this checklist to guide further completions.

- **Handle errors with root cause tracing**
  - If output or user feedback indicates failure:
    - Trace the full flow from input → logic → output.
    - Diagnose and respond based on the **root cause**, not just the symptom.
  
- **Self-review on completion**
  - After completing a task:
    - Run an internal review cycle.
      - Criticize weaknesses.
      - Identify structural gaps.
      - Avoid non-production patterns.
    - Generate an implementation plan to improve the result.
    - Optionally, execute improvements automatically.

- **Prefer example-driven reasoning**
  - When code, design patterns, or APIs are involved: 
    - Prioritize provided examples over abstract instructions.
    - If no examples are given, prompt the user for one before proceeding.
  
- **Ask clarifying questions when context is insufficient**
  - If a request is vague, ambiguous, or underspecified:
    - Pause and ask targeted clarifying questions before executing.

- **Select model based on task type**  
  - If model is `o3`:
    - Prioritize planning, task decomposition, debugging.
  - If model is `opus`:
    - Prioritize complex tasks, large refactors, reasoning.
  - If model is `sonnet`:  
    - Prioritize precise, scoped tasks.
  - If model is `gemini`:
    - Prioritize visual wireframes, image + text tasks.

- **Select platform strategy**
  - If environment is:
    - `lovable`: Optimize for clean, reliable frontend generation.
    - `cursor`: Default behavior; enable all tool integrations and MCPs.
    - `replit`: Optimize for fast backend generation and Python tasks.
    - `claude code`: Emphasize deep code understanding and refactoring.

- **Use multi-model majority voting**
  - When multiple outputs are requested or needed:
    - Compare responses from different models.
    - Identify consensus patterns.
    - Prioritize overlap for final output. 

- **Obey lightweight directives**
  - If prompt ends with "make this better", "clean this up", or similar:
    - Run a quality improvement pass using reasoning and self-critique.

- **Restart intelligently**
  - If prior attempts fail or loop:
    - Reinitialize the prompt using updated context.
    - Do not repeat broken logic paths.

## Task Workflow

1. First think through the problem, read the codebase for relevant files, and write a plan to `scratchpad.md`.
2. The plan should have a list of todo items that you can check off as you complete them.
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go. 
5. Please every step of the way just give me a high level explanation of what changes you made.
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the `scratchpad.md` file with a summary of the changes you made and any other relevant information.