# Commissioner Dashboard — Enhanced Design Specification

**Project:** SMKC Deposit Manager  
**Document:** Commissioner Dashboard Enhancement Plan  
**Date:** March 2026  
**Status:** Design Proposal

---

## 1. Overview

The Commissioner is the highest authority in the deposit lifecycle. The dashboard must give an **at-a-glance executive view** of the entire deposit portfolio — not just pending authorizations, but the full financial picture: what is invested, what is being earned, what is maturing soon, and how risk is distributed across banks.

---

## 2. Proposed Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  SMKC Commissioner Dashboard                    [Last Updated: live] │
├──────────────┬──────────────┬──────────────────┬─────────────────────┤
│ Total        │ Annual       │ Upcoming         │ Pending             │
│ Invested     │ Interest     │ Maturities       │ Authorizations      │
│ ₹ X Cr       │ ₹ Y Lakh     │ Z deposits       │ N requirements      │
│ (finalized)  │ (tentative)  │ (next 90 days)   │ (action needed)     │
├──────────────┴──────────────┴──────────────────┴─────────────────────┤
│                                                                       │
│       SECTION A: Bank-wise Investment & Interest Rate Chart           │
│               (Grouped Bar Chart — Recharts)                          │
│                                                                       │
├───────────────────────────────┬───────────────────────────────────────┤
│    SECTION B: Upcoming        │  SECTION C: Deposit Type Distribution │
│    Expiring Deposits          │  (Pie Chart: Callable vs Non-Callable) │
│    (30 / 60 / 90 day tabs)    │  + Callable Risk Summary              │
├───────────────────────────────┴───────────────────────────────────────┤
│                SECTION D: Interest Income Timeline                    │
│              (Line Chart — Month-wise projected income)               │
├──────────────────────────────────────────────────────────────────────┤
│        SECTION E: Quick Actions + Portfolio Health Score              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. KPI Cards (Top Row)

### Card 1 — Total Amount Invested
- **Value:** Sum of `amount` across all `finalized` requirements  
- **Formula:** `Σ req.amount where req.status === 'finalized'`
- **Display:** Indian number format — ₹ 2,45,00,000 or compact ₹ 2.45 Cr
- **Sub-label:** "Across N finalized deposits"
- **Color:** Green border

### Card 2 — Tentative Annual Interest Income
- **Value:** Estimated interest SMKC earns across all finalized deposits
- **Formula per deposit:**
  ```
  Simple Interest = (Principal × Rate × Period_in_months) / (12 × 100)
  ```
  Where `Rate` = the interest rate from the selected/finalized bank quote.
- **Display:** ₹ X Lakh (compact) + "per annum (estimated)"
- **Color:** Blue border
- **Note:** Marked "Tentative" as actual interest depends on compounding type chosen by bank.

### Card 3 — Upcoming Maturities (Next 90 Days)
- **Value:** Count of finalized deposits whose `finalizedAt + depositPeriod months ≤ today + 90 days`
- **Display:** Count + badge showing `30d / 60d / 90d` breakdown
- **Color:** Orange/Amber border — urgency indicator
- **Action:** Clicking navigates to the Upcoming Maturities section below

### Card 4 — Pending Authorizations (existing)
- Keep the existing card
- **Color:** Red border

---

## 4. Section A — Bank-wise Investment & Interest Rate Chart

### Chart Type
**Grouped Bar Chart** (using Recharts `ComposedChart` or `BarChart`)

### Data Model
```ts
type BankChartData = {
  bankName: string;           // e.g. "SBI", "Bank of Maharashtra"
  investedAmount: number;     // Total ₹ finalized with this bank
  interestRate: number;       // Best/selected rate from this bank's quotes
  interestIncome: number;     // Estimated annual income from this bank
};
```

### Chart Configuration
- **Left Y-axis:** Invested Amount (₹ in Lakhs or Crores)
- **Right Y-axis:** Interest Rate (%)
- **X-axis:** Bank Names
- **Bar 1 (blue):** Invested Amount per bank
- **Bar 2 (green):** Estimated interest income per bank
- **Line overlay (red):** Interest rate % — plotted on right Y-axis

### Interactions
- Hover tooltip showing: Bank Name, Amount, Rate, Estimated Income
- Click on a bank bar → filters the upcoming maturities table for that bank
- Toggle button to switch between ₹ Lakh / ₹ Crore display scale

---

## 5. Section B — Upcoming Expiring Deposits

### Purpose
The Commissioner must be notified **well in advance** so renewal requirements can be raised before a deposit matures. Late action = idle funds losing interest.

### Display
A table with **tabs: 30 Days / 60 Days / 90 Days / All**

| Scheme Name | Bank | Amount | Rate | Deposit Period | Maturity Date | Days Left | Action |
|-------------|------|--------|------|----------------|---------------|-----------|--------|
| SMKC FD 01 | SBI  | ₹50L  | 7.2% | 12 Months      | 15-Apr-2026   | 26 days   | Renew |

### Maturity Date Calculation
```ts
const maturityDate = new Date(req.finalizedAt);
maturityDate.setMonth(maturityDate.getMonth() + req.depositPeriod);
```

### Visual Urgency
- **Red row** → Matures within 30 days  
- **Orange row** → Matures within 60 days  
- **Yellow row** → Matures within 90 days  

### Action Button per Row
- **"Initiate Renewal"** → Pre-fills a new requirement form with same amount/period  
- **"View Details"** → Opens the requirement detail page

### Alert Banner
If any deposits mature within 15 days → show a dismissible red alert at the top of the dashboard.

---

## 6. Section C — Deposit Type Distribution (Pie Chart)

### Chart Type
**Donut / Pie Chart** (Recharts `PieChart`)

### Data
- **Callable:** Deposits that can be recalled by SMKC before maturity (flexible, lower rate)
- **Non-Callable:** Fixed-term deposits, cannot be withdrawn early (higher rate, less liquidity)

### Display
```
  [Donut Chart]          Summary Box
  Callable: 40%          Callable: ₹ X Cr (N deposits)
  Non-Callable: 60%      Non-Callable: ₹ Y Cr (M deposits)
                         Liquidity Available: ₹ X Cr
```

### Why This Matters for Commissioner
- Too much in Non-Callable = low liquidity if SMKC needs emergency funds
- Good ratio: 30–40% Callable, 60–70% Non-Callable (higher interest)
- Commissioner can use this to guide future requirement decisions

---

## 7. Section D — Monthly Interest Income Timeline

### Chart Type
**Line Chart / Area Chart** (Recharts `AreaChart`)

### Purpose
Shows **when** SMKC will receive interest/maturity payouts month by month over the next 12 months.

### X-axis
Next 12 months (Apr 2026 → Mar 2027)

### Y-axis
Projected interest income (₹) per month

### Calculation Logic
For each finalized deposit:
1. Calculate maturity date = `finalizedAt + depositPeriod months`
2. Calculate total interest = `(amount × rate × period) / (12 × 100)`
3. If the deposit matures in month M → attribute interest to month M
4. Plot all deposits' interest payouts on the timeline

### Display
- AreaChart with gradient fill (blue → light blue)
- Tooltip: "In April 2026, ₹ 2.1 Lakh interest expected from 3 deposits"
- Red vertical line = "Today"

---

## 8. Section E — Portfolio Health & Quick Actions

### Portfolio Health Score (0–100)
A simple computed score to help the Commissioner assess portfolio quality:

| Metric | Weight | Criteria |
|--------|--------|----------|
| Diversification (number of banks) | 25% | ≥5 banks = full score |
| Avoid single-bank concentration | 25% | No bank > 40% of total |
| Upcoming maturities managed | 25% | No deposits expiring in <15 days |
| Rate optimization | 25% | Average rate ≥ 7% |

Display as a circular gauge or progress bar (green ≥ 75, amber ≥ 50, red < 50).

### Quick Action Buttons
| Button | Action |
|--------|--------|
| 📋 Go to Approvals | Route to `/commissioner/approvals` |
| 📊 Full Reports | Route to `/commissioner/reports` |
| 🏦 View All Banks | Route to bank listing |
| ➕ New Requirement | Route to create requirement (if role allows) |
| 🔔 Set Maturity Alerts | Open alert configuration modal |

---

## 9. Data Sources & Computation

All computed values derive from existing data types already in the system:

```ts
// Existing types used
DepositRequirement {
  status: 'draft' | 'published' | 'finalized'
  amount: number
  depositPeriod: number   // months
  depositType: 'callable' | 'non-callable'
  finalizedAt?: string    // ISO date — deposit start date
  finalizedBankId?: string
}

BankQuote {
  requirementId: string
  bankId: string
  interestRate: number    // in %
  status: 'submitted' | 'selected' | 'rejected'
}
```

### Key Computed Fields Needed
```ts
// Interest income for a single deposit
function calcInterestIncome(amount: number, rate: number, periodMonths: number): number {
  return (amount * rate * periodMonths) / (12 * 100);
}

// Maturity date
function calcMaturityDate(finalizedAt: string, periodMonths: number): Date {
  const d = new Date(finalizedAt);
  d.setMonth(d.getMonth() + periodMonths);
  return d;
}

// Days until maturity
function daysUntilMaturity(maturityDate: Date): number {
  const today = new Date();
  return Math.ceil((maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
```

---

## 10. Additional Ideas

### 10.1 Maturity Alert Notifications
- When the Commissioner logs in, auto-check if any deposits mature within 30 days
- Show a notification bell with count
- Option to send email reminders (future: integrate with SMKC email service)

### 10.2 Year-over-Year Investment Comparison
- Small trend arrows next to KPI cards: ↑ 12% vs last year
- Helpful for audit and governance reporting

### 10.3 Rate Benchmark Comparison
- Show RBI repo rate as a reference line on the bank-wise chart
- Helps Commissioner judge if SMKC is getting better-than-market rates

### 10.4 Export / Print Report
- "Download PDF" button on the dashboard → generates a single-page executive summary
- Already leveraged in other parts of the app via `generate-pdf.js`

### 10.5 Deposit Renewal Tracker
- Separate column in the maturities table: "Renewal Initiated?" (Yes/No)
- So Commissioner knows which expiring deposits already have a new requirement in pipeline

### 10.6 Bank Performance Scorecard
- Mini table showing for each bank: Quotes submitted, Quotes selected, Average rate offered, Times selected as L1
- Helps SMKC identify which banks are consistently competitive

### 10.7 Audit Trail Widget
- Last 5 actions by Commissioner (Authorized X, Finalized Y, Viewed Z)
- Useful for compliance and accountability

---

## 11. Implementation Plan

### Phase 1 — KPI Cards (1–2 days)
1. Pass `quotes` (finalized) data into dashboard
2. Compute `totalInvested`, `totalInterestIncome`, `upcomingMaturities` count
3. Add 2 new KPI cards to the top row replacing/augmenting existing ones

### Phase 2 — Bank-wise Chart (2–3 days)
1. Install Recharts: `npm install recharts`
2. Aggregate bank-wise data from finalized requirements + selected quotes
3. Build `BankInvestmentChart` component

### Phase 3 — Upcoming Maturities Table (1–2 days)
1. Compute maturity dates from finalized requirements
2. Build tabbed table with 30/60/90-day filters
3. Color-coded urgency rows

### Phase 4 — Pie & Line Charts (2–3 days)
1. Build `DepositTypeDonut` component
2. Build `InterestIncomeTimeline` component
3. Integrate into dashboard layout

### Phase 5 — Polish & Alerts (1 day)
1. Portfolio Health Score widget
2. Dismissible alert banner for near-maturity deposits
3. Responsive layout testing

---

## 12. Technology Choices

| Concern | Choice | Reason |
|---------|--------|--------|
| Charts | **Recharts** | Already common in Next.js projects; well-typed; composable |
| Styling | **Tailwind CSS** | Already used in project |
| Date math | Native `Date` | No extra library needed for simple month arithmetic |
| PDF export | `generate-pdf.js` | Already exists in project |
| State | `useState` + `useEffect` | Consistent with existing pages |

---

## 13. Mockup Data for Development

While the .NET API is being updated to serve the necessary endpoints, the `mockApi.ts` can be extended with:

```ts
// Mock finalized deposits with selected quotes
const mockFinalizedData = [
  { bankId: 'bank-1', bankName: 'SBI', amount: 5000000, rate: 7.25, period: 12, finalizedAt: '2025-06-01' },
  { bankId: 'bank-2', bankName: 'Bank of Maharashtra', amount: 3000000, rate: 7.50, period: 24, finalizedAt: '2025-04-15' },
  { bankId: 'bank-3', bankName: 'Bank of India', amount: 2500000, rate: 7.10, period: 12, finalizedAt: '2025-09-01' },
  { bankId: 'bank-4', bankName: 'Canara Bank', amount: 4000000, rate: 7.40, period: 18, finalizedAt: '2025-03-01' },
];
```

---

*Document prepared for internal planning. Subject to revision based on stakeholder feedback.*
