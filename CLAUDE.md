@# AI Conversion Strategist — Product Map & Claude Code Instructions
**Product Name (working title):** ConvertIQ
**Type:** AI-powered funnel audit + rewrite tool
**Target Buyer:** DTC founders, startup marketers, freelancers, agencies
**Model:** Free taster → Credits-based purchases

---

## 1. What this product does (elevator pitch)

An AI conversion strategist that audits any part of your marketing funnel — landing pages, email sequences, ad copy, checkout pages, or your full funnel end-to-end — and doesn't just tell you what's broken. It rewrites it. Like hiring a senior CRO consultant for $29 instead of $5,000.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Fast, SEO-friendly |
| Backend | Next.js API Routes | One codebase |
| Database | Supabase (PostgreSQL) | Auth + DB + credit tracking |
| Auth | Supabase Auth | Email/password + Google OAuth |
| Payments | Lemon Squeezy | One-time credit packs, no subscription needed |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) | Core audit + rewrite engine |
| Web Scraping | Puppeteer or Cheerio | For URL-based submissions |
| Email | Resend | Transactional emails + report delivery |
| Hosting | Vercel | Zero-config deployment |
| Styling | Tailwind CSS | Fast, clean UI |

---

## 3. Business model

### Credit packs (one-time purchases via Lemon Squeezy)

| Pack | Price | Credits | Per audit |
|---|---|---|---|
| Starter | $29 | 3 credits | $9.67 |
| Growth | $79 | 10 credits | $7.90 |
| Agency | $199 | 30 credits | $6.63 |

### Free tier (lead capture)
- User submits landing page URL or pastes copy
- Gets: headline audit + top 3 conversion issues identified
- Does NOT get: full section-by-section audit or any rewrites
- Requires email capture to receive free report
- CTA: "Unlock the full audit + rewrites — 3 credits for $29"

### Credit consumption
- Landing page audit + rewrite = 1 credit
- Email sequence audit + rewrite (up to 5 emails) = 1 credit
- Ad copy audit + rewrite (up to 5 ads) = 1 credit
- Checkout / sales page = 1 credit
- Full funnel end-to-end (all sections) = 3 credits

---

## 4. Core features (MVP scope)

### 4.1 Landing / marketing homepage
- Hero with clear value prop: "Your funnel is leaking. We'll find it and fix it."
- Live demo CTA (free taster)
- Social proof section (use placeholder initially)
- Pricing / credit packs section
- FAQ

### 4.2 Free taster flow
1. User lands on homepage
2. Clicks "Audit my funnel free"
3. Chooses input method: URL or paste copy
4. Selects funnel type: Landing page / Emails / Ads / Checkout / Full funnel
5. Submits
6. Loading state: "Analyzing your funnel..." (15–30 seconds)
7. Partial results shown: headline score + top 3 issues
8. Email capture gate: "Enter your email to get your free report"
9. Full free report emailed + shown in-app (no rewrites)
10. Upgrade CTA: "Get the full audit with rewrites"

### 4.3 Full audit flow (paid)
1. User signs in / creates account
2. Has credits in account
3. Submits funnel content (URL or paste)
4. Selects audit type
5. Loading state with progress steps
6. Full results delivered:
   - Overall conversion score (0–100)
   - Section-by-section breakdown with severity ratings
   - Specific issues with psychological explanation ("This headline fails because...")
   - AI-rewritten version of every section
   - Priority action list (fix these 3 things first)
   - Shareable report link
7. 1 credit deducted from account
8. Report saved to dashboard for 90 days

### 4.4 Audit types and what each covers

**Landing Page Audit**
- Headline clarity + value prop
- Hero section (CTA placement, button copy, above-fold content)
- Social proof (reviews, logos, testimonials — presence and placement)
- Benefits vs features balance
- Trust signals (guarantees, security badges)
- CTA frequency and strength
- Page flow and visual hierarchy
- Mobile considerations
- Full rewrite of: headline, hero copy, CTA copy, key sections

**Email Sequence Audit**
- Subject line open rate potential (each email)
- Preview text optimization
- Email structure and scanability
- Value delivery vs. pitch balance
- CTA clarity per email
- Sequence flow and timing recommendations
- Full rewrite of: subject lines, preview text, body copy

**Ad Copy Audit (Meta / TikTok / Google)**
- Hook strength (first 3 seconds for video, first line for static)
- Pain/desire identification
- Offer clarity
- CTA effectiveness
- Platform-specific best practices
- Full rewrite of: hooks, body copy, CTAs, headlines

**Checkout / Sales Page Audit**
- Friction points in the purchase flow
- Objection handling above the fold
- Pricing presentation
- Urgency and scarcity (authentic vs. fake)
- Risk reversal (guarantees)
- Order bump / upsell copy
- Full rewrite of: headline, pricing section, guarantee copy, CTA

**Full Funnel End-to-End**
- All of the above combined
- Funnel flow analysis (does each step lead naturally to the next?)
- Messaging consistency across touchpoints
- The biggest leak identified and prioritized
- Costs 3 credits

### 4.5 User dashboard
- Credit balance display
- Audit history (all past reports, saved 90 days)
- Each report: view, re-run, share, download PDF
- Buy more credits button
- Account settings

### 4.6 Report features
- Shareable read-only link (for agencies sharing with clients)
- PDF export
- Copy-to-clipboard on every rewritten section
- "Re-audit" button (run again after changes — uses 1 credit)

---

## 5. Database schema (Supabase)

### users
- id (uuid, PK)
- email
- name
- credits_balance (integer, default 0)
- lemon_squeezy_customer_id
- created_at

### audits
- id (uuid, PK)
- user_id (FK → users, nullable for free/anonymous)
- email (for free tier anonymous users)
- audit_type (landing_page / email_sequence / ad_copy / checkout / full_funnel)
- input_method (url / paste)
- input_url (nullable)
- input_content (text — raw pasted content or scraped content)
- is_free_tier (boolean)
- status (pending / processing / complete / failed)
- credits_used (integer)
- result_json (jsonb — full AI response structured)
- share_token (uuid — for public read-only link)
- pdf_url (nullable)
- created_at
- expires_at (90 days from created_at)

### credit_transactions
- id (uuid, PK)
- user_id (FK → users)
- type (purchase / usage / refund / free_grant)
- amount (integer — positive for purchases, negative for usage)
- pack_name (starter / growth / agency)
- lemon_squeezy_order_id (nullable)
- audit_id (FK → audits, nullable)
- created_at

---

## 6. AI prompt architecture

### System prompt (master CRO persona)
```
You are ConvertIQ, a world-class conversion rate optimization strategist with 15+ years of experience running A/B tests and auditing funnels for DTC brands, SaaS companies, and service businesses. You have personally managed over $50M in ad spend and know exactly what makes people buy — and what makes them leave.

Your audits are:
- Brutally honest (you don't sugarcoat)
- Specific (you name the exact problem, not vague advice)
- Psychological (you explain WHY something fails using buyer psychology)
- Actionable (every issue comes with a rewritten version)
- Prioritized (you rank fixes by revenue impact)

You understand: Cialdini's persuasion principles, Jobs-to-be-Done theory, pain/desire copywriting, the AIDA framework, above-the-fold optimization, social proof hierarchy, risk reversal, urgency mechanics, and mobile conversion behavior.

Your output is always structured as valid JSON matching the schema provided.
```

### Output JSON schema (landing page example)
```json
{
  "audit_type": "landing_page",
  "overall_score": 42,
  "score_label": "Low conversion potential",
  "score_summary": "Multiple critical issues detected. Quick wins available.",
  "top_issues": [
    {
      "severity": "critical",
      "section": "headline",
      "issue": "Headline fails the 5-second test",
      "explanation": "Your headline says X. This tells visitors nothing about who it's for or what they get.",
      "psychology": "Visitors need to self-identify within 5 seconds or they leave. Generic headlines fail this.",
      "original": "[original headline text]",
      "rewrite": "[AI rewritten headline]",
      "impact": "high"
    }
  ],
  "section_scores": {
    "headline": 30,
    "hero": 45,
    "social_proof": 20,
    "cta": 55,
    "benefits": 60,
    "trust_signals": 40
  },
  "priority_actions": [
    "Rewrite headline to include specific audience + outcome",
    "Add social proof above the fold",
    "Change CTA from 'Submit' to benefit-driven copy"
  ],
  "full_rewrite": {
    "headline": "[rewritten]",
    "hero_copy": "[rewritten]",
    "cta_copy": "[rewritten]",
    "social_proof_section": "[rewritten]"
  }
}
```

### Prompt variations per audit type
Each audit type gets its own user prompt template with:
- The scraped/pasted content injected
- Specific instructions for that funnel type
- The JSON schema for that type's output
- Instruction to be specific, use examples, and always rewrite

---

## 7. Web scraping approach

### URL submission flow
1. User submits URL
2. API route calls Puppeteer (headless Chrome) to:
   - Load the page (wait for JS rendering)
   - Extract: title, meta description, all headings (h1-h3), all paragraph text, all button/CTA text, all testimonial/review text
   - Strip nav, footer, cookie banners
3. Cleaned text passed to Claude API
4. If scraping fails → show error + offer "paste your copy instead" fallback

### Paste submission flow
1. User pastes raw copy into textarea
2. Basic cleaning (remove extra whitespace)
3. Passed directly to Claude API

---

## 8. Page / route structure

```
app/
├── (marketing)/
│   ├── page.tsx              ← Homepage + free taster
│   ├── pricing/page.tsx
│   └── examples/page.tsx     ← Sample audit results (social proof)
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (dashboard)/
│   ├── layout.tsx            ← Dashboard shell
│   ├── page.tsx              ← Audit history + credit balance
│   ├── new/page.tsx          ← New audit submission form
│   └── reports/
│       └── [id]/page.tsx     ← Individual audit report
├── (public)/
│   └── r/[share_token]/      ← Public shareable report (read-only)
├── api/
│   ├── audit/
│   │   ├── create/route.ts   ← Submit new audit
│   │   ├── scrape/route.ts   ← URL scraping endpoint
│   │   └── [id]/route.ts     ← Get audit status/results
│   ├── credits/
│   │   └── balance/route.ts
│   └── webhooks/
│       └── lemon-squeezy/route.ts ← Credit purchase webhook
```

---

## 9. User flows

### Free taster flow
1. Homepage → "Audit my funnel free" CTA
2. Input form (URL or paste, select type)
3. Processing state (animated, ~20 seconds)
4. Partial results shown (score + 3 issues, no rewrites, blurred)
5. Email capture: "Get your full free report"
6. Email sent via Resend with free report
7. In-app: upgrade prompt with credit pack options

### Paid audit flow
1. Sign up / log in
2. Purchase credit pack → Lemon Squeezy checkout
3. Webhook fires → credits added to account
4. New audit page → submit content
5. Processing (~30 seconds)
6. Full report page with all sections, rewrites, score
7. Options: share link, download PDF, re-audit

---

## 10. MVP build phases

### Phase 1 — Core (week 1)
- [ ] Next.js project setup + Supabase schema
- [ ] Supabase Auth (email + Google)
- [ ] Homepage with free taster form
- [ ] URL scraping endpoint (Cheerio for static, Puppeteer fallback)
- [ ] Claude API integration — landing page audit prompt
- [ ] Free tier results display (partial, gated)
- [ ] Email capture + Resend integration
- [ ] Report display component

### Phase 2 — Payments + Full Audits (week 2)
- [ ] Lemon Squeezy credit pack setup (3 products)
- [ ] Webhook handler → credit balance update
- [ ] Auth-gated dashboard with credit balance
- [ ] Full audit flow (all 5 audit types)
- [ ] Claude prompts for all 5 audit types
- [ ] Credit deduction logic
- [ ] Audit history dashboard

### Phase 3 — Polish + Reports (week 3)
- [ ] PDF report generation
- [ ] Shareable read-only report links
- [ ] Copy-to-clipboard on rewrites
- [ ] Re-audit functionality
- [ ] Examples/sample reports page (marketing)
- [ ] Empty states, error states, loading states
- [ ] Mobile responsive pass

### Phase 4 — Launch (end of week 3)
- [ ] Pricing page
- [ ] FAQ page
- [ ] Product Hunt prep
- [ ] Beta launch to DTC/marketing communities

---

## 11. CLAUDE.md (paste into project root)

```markdown
# ConvertIQ — Claude Code Context

## What this is
An AI-powered conversion rate optimization tool. Users submit their funnel content (landing pages, emails, ads, checkout pages) via URL or pasted copy and receive a full audit with severity-rated issues, psychological explanations, and AI-rewritten copy. Built on a credits model — free partial audit, paid full audits.

## Tech stack
- Next.js 14 (App Router) — frontend + API routes
- Supabase — PostgreSQL database + authentication
- Lemon Squeezy — one-time credit pack purchases + webhooks
- Anthropic Claude API (claude-sonnet-4-20250514) — audit and rewrite engine
- Cheerio / Puppeteer — URL scraping
- Resend — transactional email
- Tailwind CSS — styling
- Vercel — hosting

## Key principles
- All Claude API calls must return structured JSON — never prose
- Scraping must have graceful fallback to manual paste if URL fails
- Credit balance must be checked BEFORE running any paid audit
- Free tier audits never deduct credits
- Audit results stored in Supabase for 90 days then deleted
- Share tokens are public — no auth required to view shared reports
- All prompts live in /lib/prompts/ — never inline in API routes

## Database
- Schema in /supabase/schema.sql
- Supabase client in /lib/supabase.ts (server) and /lib/supabase-client.ts (browser)
- Never expose service role key client-side
- RLS enabled — users can only access their own audits

## Credits system
- credits_balance lives on the users table
- Deduct credits atomically using Supabase RPC function (prevent race conditions)
- Credit pack webhooks from Lemon Squeezy at /api/webhooks/lemon-squeezy
- Free audits: is_free_tier = true, credits_used = 0
- Paid audits: deduct before running AI (refund if AI fails)

## AI prompts
- System prompt in /lib/prompts/system.ts
- Per-type user prompts in /lib/prompts/[audit-type].ts
- All prompts instruct Claude to return ONLY valid JSON
- Parse response with try/catch — if JSON invalid, retry once then fail gracefully
- Max tokens: 4000 for free tier, 8000 for paid

## Audit types
- landing_page — 1 credit
- email_sequence — 1 credit  
- ad_copy — 1 credit
- checkout — 1 credit
- full_funnel — 3 credits

## Scraping
- Try Cheerio first (fast, static pages)
- Fall back to Puppeteer for JS-rendered pages
- Extract: h1-h3, p, button, .cta, [data-testid], meta title/description
- Strip: nav, footer, cookie banners, scripts, styles
- Max content length: 8000 characters (truncate if longer)

## File structure
- /app — Next.js app router pages and API routes
- /components — reusable UI components
- /lib — utilities, Supabase client, AI prompts, scraper
- /types — TypeScript types
- /supabase — schema and migrations

## Current build phase
Phase 1 — Core infrastructure
Focus: Homepage, free taster flow, URL scraping, Claude API integration, landing page audit prompt, email capture
```

---

## 12. What to build first (today)

1. `npx create-next-app@latest convertiq` with TypeScript + Tailwind
2. Set up Supabase project — run schema from section 5
3. Create `/lib/prompts/system.ts` with the master CRO persona prompt
4. Create `/lib/prompts/landing-page.ts` with the landing page audit prompt + JSON schema
5. Create `/app/api/audit/scrape/route.ts` — URL scraper using Cheerio
6. Create `/app/api/audit/create/route.ts` — calls Claude API, returns JSON
7. Build the homepage with free taster form
8. Drop CLAUDE.md into project root
9. Open Claude Code — start Phase 1 tasks one at a time

---

*Last updated: March 2026*
*Status: Pre-build — mapping complete, ready for Claude Code*

