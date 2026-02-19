# FP&A Portfolio — Decision-Grade Finance Systems
### Ralph Patrick Divina

A production-ready **FP&A portfolio** built as interactive, executive-friendly modules — not screenshots, not static spreadsheets.

This repo showcases how I think and build as a finance operator: **drivers → models → KPIs → scenarios → decision outputs**.

🔗 **Live site:** [View on GitHub Pages](https://ralphpatrick.github.io)
🔗 **LinkedIn:** [ralph-patrick-divina](https://www.linkedin.com/in/ralph-patrick-divina-55534614a/)

---

## What this is

Think of this like a "finance playground" for CEOs / CFOs / FP&A Leads:

- Change assumptions
- Run **Base / Upside / Downside** scenarios
- See KPIs and charts update instantly
- Get **decision-focused outputs** — not just numbers

Built to prove:
- FP&A system thinking
- Commercial + operating finance fluency
- Modeling architecture (not spreadsheet chaos)
- Narrative and decision-making outputs

---

## How to navigate

The landing page (`index.html`) opens with a **"What's the problem you're solving?"** section — pick the CFO-level question that fits your situation and jump directly to the right module. No hunting required.

---

## Modules

### Core FP&A Simulator — Industry-Adaptive
**File:** `core-fp_a.html`

Flexible planning simulator adaptable across business types — SaaS, ecommerce, services, etc.

**When it's useful:**
- You need a fast budget / forecast baseline that flexes with new assumptions
- Leadership asks "what changes the outcome most?" and you need scenario answers fast
- You're building a repeatable FP&A engine: drivers → outputs

> *Real-life scenario: CEO asks "If we slow hiring + raise price a bit, do we extend runway?" This is your sandbox.*

---

### SaaS / Fintech Unit Economics
**File:** `unit-economics.html`

Turns CAC, churn, ARPA, gross margin, and OpEx into runway and sustainability signals.

**When it's useful:**
- You're deciding: raise vs. slow growth vs. cut burn
- You need to sanity-check LTV:CAC, payback period, and churn sensitivity
- You're aligning Sales/Marketing spend with finance reality

> *Real-life scenario: Growth team wants to scale ads. You show if it's profitable growth or just faster dying.*

---

### KPI Tree & Driver Sensitivity
**File:** `kpi-tree-sensitivity.html`

Maps KPIs into a driver tree and ranks sensitivity — which levers actually move the needle.

**When it's useful:**
- Leadership says "improve profitability" but nobody agrees which lever matters
- You need a clean way to prioritize top 3 drivers instead of random initiatives
- You want to explain finance to a non-finance exec without losing them

> *Real-life scenario: CFO asks "what's the #1 lever this quarter?" This shows it without debate.*

---

### Revenue Bridge & Cohort Retention
**File:** `revenue-bridge.html`

Explains revenue movement (bridge) and retention / cohort behavior month by month.

**When it's useful:**
- Revenue changed and the board asks "why?"
- You need to separate new, expansion, churn, and reactivation
- Product/success teams need retention insights tied to dollars

> *Real-life scenario: Revenue is flat but sales says "pipeline is strong." This shows if churn is eating your wins.*

---

### Working Capital FP&A
**File:** `working-capital.html`

Models working-capital drivers and cash impact — AR, AP, and inventory behavior.

**When it's useful:**
- You're profitable on the P&L but cash feels tight (classic trap)
- You need to model DSO/DPO changes and their cash runway impact
- Ops and finance need alignment on collections and payment discipline

> *Real-life scenario: Business is "growing" but cash keeps dipping. This tells you if AR is the villain.*

---

### Operations Finance & Spend Analytics
**File:** `operations-spend.html`

Tracks spend behavior, flags rate card leakage, and supports cost control decisions — with three randomized outcome modes: **Positive (clean run) / Mid (watch spend) / Negative (leakage alert)**.

**When it's useful:**
- You need to find spend leaks and explain variance
- You're building a monthly cadence: actuals vs. budget vs. forecast
- Teams keep spending and finance keeps reacting late

> *Real-life scenario: "Why did OpEx spike?" This is your answer machine.*

---

### Indirect Cost & Headcount CoE
**File:** `indirect-cost-headcount.html`

Headcount and indirect cost control center — connects staffing decisions to cost structure.

**When it's useful:**
- Hiring is moving fast and finance needs a headcount governor
- You're modeling org changes, spans/layers, and cost per function
- You need to decide "hire now" vs. "delay hire" with cost clarity

> *Real-life scenario: Department requests 3 hires. This shows cost impact and tradeoffs instantly.*

---

### Commercial / Sales Finance Model
**File:** `commercial-sales.html`

Sales and commercial planning view — pipeline assumptions → revenue → profitability logic.

**When it's useful:**
- You need sales capacity planning: HC, quota, win rate
- Leadership asks "is revenue realistic or vibes?"
- You want to connect GTM strategy to finance outcomes

> *Real-life scenario: Sales says "we'll double revenue." This forces the math: pipeline + conversion + capacity.*

---

### Capex & Financing Decisions
**File:** `capex-financing.html`

Capex decision modeling with financing implications — cash vs. loan vs. lease tradeoffs with NPV and payback analysis.

**When it's useful:**
- You're deciding buy vs. lease, timing, and funding method
- You need to show capex impact on runway and liquidity
- Leadership needs a clean yes/no rationale with the math to back it

> *Real-life scenario: Ops wants equipment now. This shows if it's smart, affordable, and fundable.*

---

## System View

These aren't isolated spreadsheets — they form a single **Finance Operating System**:

```
Core FP&A → Commercial → Unit Economics → Operations Spend
     ↓
Indirect Cost & Headcount → Working Capital → Revenue Bridge
     ↓
Capex & Financing → KPI Tree & Sensitivity → Decision Engine
```

In practice: a leader asks *"should we hire, cut, raise prices, push a promo, or slow down?"* — this system turns that question into numbers you can trust and a clear recommendation.

---

## UX decisions worth noting

- **No scroll jumps on data changes** — all data-trigger buttons (Use Sample, Randomize, Reset, scenario tabs) use a `withStableScroll()` helper that captures and restores viewport position around chart redraws. No content flicker, no viewport snap.
- **Problem-first navigation** — the landing page leads with CFO-level pain statements, not module names. Pick the problem → open the model.
- **Decision boxes** — every module ends with a verdict card (Positive / Warning / Negative) that states a concrete action, not just a summary.
- **Randomize generates coherent scenarios** — not pure noise. Operations Spend, for example, randomly picks a Positive / Mid / Negative outcome mode and generates data consistent with that mode end-to-end.

---

## How to run

### Option A — local
Open `index.html` in any browser. No server, no build step, no dependencies to install.

### Option B — GitHub Pages
1. Repo → **Settings**
2. **Pages**
3. Source: `main` branch → `/ (root)`
4. Save, then open the Pages URL

---

## Tech stack

| Layer | Tool |
|---|---|
| Structure | HTML5 |
| Styling | CSS (custom design system via `style.css`) |
| Behavior | Vanilla JavaScript — no frameworks |
| Charts | [Chart.js 4.4](https://www.chartjs.org/) |
| CSV parsing | [PapaParse](https://www.papaparse.com/) |

No build pipeline. No npm. No frameworks. Fast to load and easy to review in any code editor.

---

## Shared assets

| File | Purpose |
|---|---|
| `style.css` | Full design system — typography, colors, layout, components |
| `main.js` | Nav behavior, scroll reveals, back-to-top, `withStableScroll()` helper |
| `favicon.png` | Site icon (credit: J703 via Flaticon) |

---

## Who this is for

If you're hiring for any of the following, this repo is intended as direct proof of work:

- FP&A / Finance Business Partner
- Finance Ops / Finance Lead
- Strategic Finance
- CFO-style IC (systems + insights + execution)

---

## Roadmap

Ideas I can build next depending on role and company context:

- Sensitivity engine — 1-click tornado / driver ranking
- Board-slide export — auto "Board Summary" PDF
- Multi-entity consolidation layer
- Import templates per industry (standardized CSV schemas)
- Audit trail of assumption changes — who changed what and when

---

## Attribution

Favicon: "Central bank icons created by J703 — Flaticon"
https://www.flaticon.com/free-icons/central-bank
