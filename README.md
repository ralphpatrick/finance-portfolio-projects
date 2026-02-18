# FP&A Portfolio — Decision-Grade Finance Systems (Ralph Patrick Divina)

A production-ready **FP&A portfolio** built as interactive, executive-friendly modules (not screenshots, not static spreadsheets).

This repo showcases how I think and build as a finance operator: **drivers → models → KPIs → scenarios → decision outputs**.

---

## What this is

Think of this like a “finance playground” for CEOs/CFOs/FP&A Leads:

- You can **change assumptions**
- run **Base / Upside / Downside**
- see **KPIs + charts update instantly**
- get **decision-focused outputs** (not just numbers)

Built to prove:
- FP&A system thinking
- commercial + operating finance fluency
- modeling architecture (not spreadsheet chaos)
- narrative + decision-making outputs

---

## Modules + Use Cases (When this is helpful)

Start here:
- **Home / Portfolio** (`index.html`)
  - **Use case:** quick tour for recruiters/hiring managers; single entry point for everything.
  - **Helpful when:** you want someone to “get it” in 30 seconds without hunting pages.  
  - (This is the main site entry.) 

---

### 1) Core FP&A Simulator — Industry-Adaptive (`core-fp&a.html`)
- **What it does:** flexible planning simulator you can adapt across business types (SaaS, ecommerce, services, etc.). :contentReference[oaicite:1]{index=1}
- **Helpful when:**
  - you need a fast **budget/forecast baseline** that can flex with new assumptions
  - leadership asks “**what changes the outcome most?**” and you need scenario answers
  - you’re building a **repeatable FP&A engine** (drivers → outputs)

**Real-life scenario:** CEO asks “If we slow hiring + raise price a bit, do we extend runway?” This module is your sandbox.

---

### 2) SaaS / Fintech Unit Economics (`unit-economics.html`)
- **What it does:** turns CAC, churn, ARPA, gross margin, and OpEx into runway + sustainability signals. :contentReference[oaicite:2]{index=2}
- **Helpful when:**
  - you’re deciding **raise vs. slow growth vs. cut burn**
  - you need to sanity-check **LTV:CAC, payback, churn sensitivity**
  - you’re aligning Sales/Marketing spend with finance reality

**Real-life scenario:** growth team wants to scale ads. You show if it’s profitable growth or just faster dying.

---

### 3) KPI Tree & Driver Sensitivity (`kpi-tree-sensitivity.html`)
- **What it does:** maps KPIs into a driver tree and shows sensitivity (what moves the needle). :contentReference[oaicite:3]{index=3}
- **Helpful when:**
  - leadership says “improve profitability” but nobody agrees **which lever matters**
  - you need a clean way to prioritize **top 3 drivers** instead of random initiatives
  - you want to explain finance like you’re teaching a non-finance exec

**Real-life scenario:** CFO asks “what’s the #1 lever this quarter?” This shows it without debate.

---

### 4) Revenue Bridge & Cohort Retention (`revenue-bridge.html`)
- **What it does:** explains revenue movement (bridge) and retention/cohort behavior. :contentReference[oaicite:4]{index=4}
- **Helpful when:**
  - revenue changed and the board asks **“why?”**
  - you need to separate **new, expansion, churn, reactivation**
  - product/success teams need retention insights tied to $$$

**Real-life scenario:** revenue is flat but sales says “pipeline is strong.” This shows if churn is eating your wins.

---

### 5) Working Capital FP&A (`working-capital.html`)
- **What it does:** working-capital drivers and cash impact (AR/AP/inventory behavior). :contentReference[oaicite:5]{index=5}
- **Helpful when:**
  - you’re profitable on P&L but cash feels broke (classic trap)
  - you need to model **DSO/DPO** changes and cash runway impact
  - ops + finance need alignment on collections/payment discipline

**Real-life scenario:** business is “growing” but cash keeps dipping. This tells you if AR is the villain.

---

### 6) Operations Finance & Spend Analytics (`operations-spend.html`)
- **What it does:** tracks spend behavior, flags inefficiencies, supports cost control and operational decisions. :contentReference[oaicite:6]{index=6}
- **Helpful when:**
  - you need to find **spend leaks** and explain variance
  - you’re building a monthly cadence: **actuals vs budget vs forecast**
  - teams keep spending and finance keeps reacting late

**Real-life scenario:** “Why did OpEx spike?” This is your answer machine.

---

### 7) Indirect Cost & Headcount CoE (`indirect-cost-headcount.html`)
- **What it does:** headcount + indirect cost control center; connects staffing to cost structure. :contentReference[oaicite:7]{index=7}
- **Helpful when:**
  - hiring is happening fast and finance needs a **headcount governor**
  - you’re modeling **org changes, spans/layers, cost per function**
  - you need to decide “hire now” vs “delay hire” with cost clarity

**Real-life scenario:** department requests 3 hires. This shows cost impact and tradeoffs instantly.

---

### 8) Commercial / Sales Finance Model (`commercial-sales.html`)
- **What it does:** sales/commercial planning view—pipeline assumptions → revenue → profitability logic. :contentReference[oaicite:8]{index=8}
- **Helpful when:**
  - you need **sales capacity planning** (HC, quota, win rate)
  - leadership asks “is revenue realistic or vibes?”
  - you want to connect GTM strategy to finance outcomes

**Real-life scenario:** sales says “we’ll double revenue.” This forces the math: pipeline + conversion + capacity.

---

### 9) Capex & Financing Decisions (`capex-financing.html`)
- **What it does:** capex decision modeling + financing implications (cash/financing tradeoffs). :contentReference[oaicite:9]{index=9}
- **Helpful when:**
  - you’re deciding **buy vs lease**, timing, and funding method
  - you need to show capex impact on **runway + liquidity**
  - leadership needs a clean “yes/no” rationale

**Real-life scenario:** ops wants equipment now. This shows if it’s smart, affordable, and fundable.

---

## Shared assets
- `style.css` — executive UI system :contentReference[oaicite:10]{index=10}
- `main.js` — navigation + reveal behavior :contentReference[oaicite:11]{index=11}
- `favicon.png` :contentReference[oaicite:12]{index=12}


Shared assets:
- `style.css` (executive UI system)
- `main.js` (navigation + reveal behavior)
- `favicon.png`

---

## How to run (zero setup)

### Option A — local
Just open `index.html` in your browser.

### Option B — GitHub Pages (recommended)
1. Repo → **Settings**
2. **Pages**
3. Source: `main` branch → `/ (root)`
4. Save, then open the Pages link

---

## What makes this “CFO-grade”

Most portfolios show Excel. This behaves like internal finance software:

- **Driver-based modeling** (not manual cell pushing)
- **Scenario logic** (Base/Upside/Downside)
- **Decision outputs** (e.g., “raise / cut burn / slow growth” style conclusions inside modules)
- **Executive UX** (fast, clear, readable)

---

## Tech Stack

- HTML + CSS
- Vanilla JavaScript
- Chart.js (charts)
- PapaParse (CSV parsing)

No frameworks. Fast to load. Easy to review. Runs anywhere.

---

## Who this is for

If you’re hiring for any of these, this repo is meant to be a direct proof of work:

- FP&A / Finance Business Partner
- Finance Ops / Finance Lead
- Strategic Finance
- CFO-style IC (systems + insights + execution)

---

## Roadmap (next upgrades)

Ideas I can build next (depending on role/company needs):
- sensitivity engine (1-click tornado / driver ranking)
- board-slide export (auto “Board Summary” PDF)
- multi-entity consolidation layer
- import templates per industry (standardized CSV schemas)
- audit trail of assumption changes (“who changed what”)

---

## Links

- GitHub: https://github.com/ralphpatrick  
- LinkedIn: https://www.linkedin.com/in/ralph-patrick-divina-55534614a/

---

## Attribution

Favicon credit: “Central bank icons created by J703 – Flaticon”  
https://www.flaticon.com/free-icons/central-bank
