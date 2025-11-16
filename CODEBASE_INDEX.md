# RoastMyCV — Codebase Index

Project root: `c:\Users\GANES\Downloads\ROASTMYCV-main\ROASTMYCV-main`

## Summary
- **Purpose:** AI-powered resume review ("RoastMyCV") built as a Vite + React + TypeScript app with Tailwind CSS and several UI helpers (shadcn-like components). The app provides resume upload, PDF text extraction, LLM-powered critique, and several utility features (badges, analytics, templates).
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Clerk for auth, LangChain + Google Generative AI (Gemini) integration, pdfjs for PDF parsing.

## How to run (from `package.json`)
- **Dev:** `npm run dev` (runs `vite`)
- **Build:** `npm run build` (runs `vite build`)
- **Preview:** `npm run preview` (runs `vite preview`)
- **Lint:** `npm run lint` (runs `eslint .`)
- **Build (dev mode):** `npm run build:dev` (vite build --mode development)

## Notable dependencies
- UI / utilities: `react`, `react-dom`, `tailwindcss`, `@radix-ui/*`, `lucide-react`, `clsx`, `tailwind-merge`, `sonner` (toasts)
- Routing + data: `react-router-dom`, `@tanstack/react-query`
- Auth: `@clerk/clerk-react`
- LLM / RAG: `@langchain/core`, `@langchain/google-genai` (Gemini)
- PDF parsing: `pdfjs-dist`
- Build/tooling: `vite`, `@vitejs/plugin-react-swc`, `typescript`

## Key directories and files
- `src/` — application source
  - `main.tsx` — app bootstrap; wraps `App` in `ClerkProvider` and renders to DOM. Expects a Clerk publishable key (placeholder present in file).
  - `App.tsx` — routing and global providers (QueryClient, TooltipProvider, Toaster). Defines public and protected routes and uses `ClerkLoaded`, `SignedIn`, `SignedOut` for protected routes.
  - `index.css`, `App.css` — global styles (Tailwind + app CSS)

- `src/components/` — UI and domain components
  - Domain components: `ResumeRoaster.tsx`, `ResumeAnalytics.tsx`, `ResumeFormatChecker.tsx`, `ResumeKeywordAnalyzer.tsx`, `ResumeProgressTracker.tsx`, `ResumeTemplates.tsx`, `ResumeTimelineBuilder.tsx`, `ResumeTipsLibrary.tsx`, `RoastResult.tsx`, `TechnicalReport.tsx`, etc.
  - Interaction components: `ChatContainer.tsx`, `ChatInput.tsx`, `ChatMessage.tsx`, `AudioFeedback.tsx`, `BadgeGenerator.tsx`, `ColorPaletteGenerator.tsx`, `ContactValidator.tsx`, `FontPairingGuide.tsx`, `Hyperspeed.tsx`, `InsightPanel.tsx`, `IntensitySelector.tsx`, `Logo.tsx`, `NavBar.tsx`
  - `ui/` — many small UI primitives (shadcn-style): `button.tsx`, `input.tsx`, `toast.tsx`, `toaster.tsx`, `tooltip.tsx`, `dialog.tsx`, `card.tsx`, etc.

- `src/pages/` — route pages
  - Notable pages: `Home.tsx`, `Roaster.tsx`, `Auth.tsx`, `Profile.tsx`, `Templates.tsx`, `Tips.tsx`, `FormatChecker.tsx`, `KeywordAnalyzer.tsx`, `PowerWords.tsx`, `ResumeAnalytics.tsx`, `TechnicalReport.tsx`, `TimelineBuilder.tsx`, `ColorPalettes.tsx`, `ContactValidator.tsx`.

- `src/services/` — application services
  - `resumeService.ts` — contains `roastResume` and PDF extraction using `pdfjs-dist`, and invokes LangChain `ChatGoogleGenerativeAI` configured for `gemini-2.0-flash`. Note: an API key is present in the file (hardcoded) — this should be secured.
  - `chatService.ts`, `audioService.ts` — other integration code (not fully examined here).

- `src/lib/utils.ts` — utility helpers (e.g., `cn` wrapper using `clsx` + `twMerge`).
- `src/hooks/` — `use-mobile.tsx`, `use-toast.ts` (custom hooks)
- `tailwind.config.ts` and `src/tailwind.config.ts` — Tailwind configuration present

## Observations & important notes
- Authentication: `Clerk` is used. `main.tsx` currently includes a hardcoded `PUBLISHABLE_KEY` placeholder string. Update to use env var `VITE_CLERK_PUBLISHABLE_KEY` or similar in `.env` for production.
- LLM integration: `resumeService.ts` initializes `ChatGoogleGenerativeAI` with a hardcoded `API_KEY` and `modelName: "gemini-2.0-flash"`. This key must be moved to a secure server-side vault or environment variable — avoid exposing it in frontend code.
- PDF extraction: Uses `pdfjs-dist` client-side to extract text from uploaded PDFs.
- Routing: `App.tsx` centralizes routes; protected routes use a `PrivateRoute` wrapper based on `Clerk` auth components.
- Large components: `src/pages/Home.tsx` is sizeable (interactive demo, animations). Many other pages likely include detailed UI and logic.

## Quick map (file lists)
- `src/components/` (high-level):
  - AudioFeedback.tsx, BadgeGenerator.tsx, ChatContainer.tsx, ChatInput.tsx, ChatMessage.tsx, ColorPaletteGenerator.tsx, ContactValidator.tsx, FontPairingGuide.tsx, Hyperspeed.tsx, InsightPanel.tsx, IntensitySelector.tsx, Logo.tsx, NavBar.tsx, ResumeAnalytics.tsx, ResumeFormatChecker.tsx, ResumeKeywordAnalyzer.tsx, ResumePowerWords.tsx, ResumeProgressTracker.tsx, ResumeRoaster.tsx, ResumeTemplates.tsx, ResumeTimelineBuilder.tsx, ResumeTipsLibrary.tsx, RoastResult.tsx, TechnicalReport.tsx
- `src/components/ui/` (primitives): many (accordion, alert, button, card, input, tooltip, toast, etc.)
- `src/pages/`: Auth.tsx, ColorPalettes.tsx, ContactValidator.tsx, FontPairing.tsx, FormatChecker.tsx, Home.tsx, Index.tsx, KeywordAnalyzer.tsx, NotFound.tsx, PowerWords.tsx, Pricing.tsx, Profile.tsx, Progress.tsx, ResumeAnalytics.tsx, Roaster.tsx, TechnicalReport.tsx, Templates.tsx, TimelineBuilder.tsx, Tips.tsx
- `src/services/`: audioService.ts, chatService.ts, resumeService.ts

## Security & configuration checklist (recommended)
- Move any hardcoded keys (`API_KEY`, `PUBLISHABLE_KEY`) to environment variables and never commit them.
- Add/verify `.env.example` documenting required variables (e.g., `VITE_CLERK_PUBLISHABLE_KEY`, `LLM_API_KEY`, etc.).
- Consider moving LLM calls to a server-side endpoint to hide API keys and enforce rate limits/cost control.

## Next steps I can do for you
- Create a `CODEBASE_INDEX.md` (done) and add a concise `ENVIRONMENT.md` describing env vars to set up.
- Search for any other occurrences of hardcoded secrets and create a patch to use env vars.
- Run `npm install` and start the dev server locally (I can provide the exact commands).

---
Generated on: 2025-11-16
