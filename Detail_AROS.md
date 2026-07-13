# AROS — AI Reliability Overlay System

A real-time AI reliability layer that catches hallucinations **before they catch you**. AROS analyzes any AI-generated text and returns a confidence score, fact-check verdicts, and an overall risk rating — helping students, professors, and professionals judge whether AI output can be trusted before they act on it.

> **Tagline:** *Real-time AI fact-checking, confidence scoring, and hallucination detection.*

##  Features

- **Real-Time Analysis**: Paste any AI output and get an instant reliability verdict
- **Confidence Scoring**: A 0–100 score based on linguistic and structural signals
- **Hallucination Detection**: Flags telltale phrases like *"I have access to your database"* or *"according to my records"*
- **Fact Checking**: Extracts claims (dollar amounts, percentages, dates) and verifies them against a reference database
- **Risk / Accuracy Rating**: Combines confidence + verification into a single `high / medium / low / critical` verdict with color, emoji, and recommendations
- **History & Dashboard**: Tracks past analyses, hallucinations caught, and average accuracy over time
- **One-Click Samples**: Built-in examples (high confidence, hallucination, missing citations, mixed quality) for instant demos

## Tools Used

### Core Technologies
* **React 18 + TypeScript** — component-based, type-safe frontend
* **Vite** — fast dev server and build tooling (SWC-powered React plugin)
* **Tailwind CSS + shadcn/ui (Radix UI)** — design system and accessible components
* **Framer Motion** — page and element animations
* **Recharts** — dashboard data visualization
* **React Router** — client-side routing (`/`, `/demo`, `/dashboard`)
* **TanStack Query** — async data/state management
* **Zod + React Hook Form** — schema validation and forms
* **FastAPI backend on Hugging Face Spaces** — `https://rithanya918-aros.hf.space` (GPT-4o powered)
* **Vitest + Testing Library + Playwright** — unit and end-to-end testing

## System Architecture

```mermaid
graph TB
    User[User] -->|Paste AI text| WebUI[React Web App]

    WebUI --> Landing[Landing Page /]
    WebUI --> Demo[Demo / Fact Checker /demo]
    WebUI --> Dashboard[Dashboard /dashboard]

    Demo -->|POST /api/analyze| Backend[AROS Backend<br/>Hugging Face Space]
    Dashboard -->|GET /api/history| Backend

    Backend --> Engine[Reliability Engine]
    Engine --> Conf[Confidence Analyzer]
    Engine --> Fact[Fact Checker]
    Engine --> Risk[Risk / Accuracy Scorer]

    Fact --> RefDB[(Reference Database)]

    Engine -->|AnalysisResponse JSON| Demo
    Demo --> Results[Analysis Results UI]

    classDef user fill:#e1f5fe
    classDef frontend fill:#f3e5f5
    classDef backend fill:#e8f5e8
    classDef engine fill:#fff3e0
    classDef data fill:#fce4ec

    class User user
    class WebUI,Landing,Demo,Dashboard,Results frontend
    class Backend backend
    class Engine,Conf,Fact,Risk engine
    class RefDB data
```

> **Note:** AROS ships with a **local TypeScript engine** (`src/lib/arosEngine.ts`) that mirrors the backend logic, plus a **hosted backend** (`src/lib/api.ts`). The Demo page calls the backend for GPT-4o-grade analysis; the local engine documents/duplicates the scoring rules and can serve as an offline reference implementation.

## Complete Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser (React)
    participant A as api.ts
    participant S as AROS Backend (HF Space)
    participant E as Reliability Engine
    participant D as Reference DB

    U->>B: Paste AI text + click Analyze
    B->>A: analyzeTextWithBackend(text)
    A->>S: POST /api/analyze {text, user_profile, source_platform}

    Note over S,E: Step 1: Confidence Analysis
    S->>E: analyzeConfidence(text)
    E->>S: score, level, factors, flags

    Note over S,E: Step 2: Fact Checking
    S->>E: checkFacts(text)
    E->>D: Look up grants / stats / facts
    D->>E: reference values
    E->>S: verified / conflict / unverified claims

    Note over S,E: Step 3: Risk Scoring
    S->>E: calculateRisk(confidence, factChecks)
    E->>S: accuracy score + recommendations

    S->>A: AnalysisResponse JSON
    A->>B: toArosAnalysis() → normalized shape
    B->>U: Render confidence, fact checks, risk badge
```

## Analysis Pipeline

```mermaid
graph LR
    Start([AI Text Input]) --> C1[1. Confidence Analyzer]
    C1 --> C2[2. Fact Checker]
    C2 --> C3[3. Risk / Accuracy Scorer]
    C3 --> End([Reliability Verdict])

    style Start fill:#e1f5fe
    style End fill:#c8e6c9
    style C1 fill:#fff9c4
    style C2 fill:#ffe0b2
    style C3 fill:#ffccbc
```

## Confidence Analyzer — Signals

The confidence analyzer starts at **100** and subtracts points for each risk signal it detects.

```mermaid
graph TD
    Text[Input Text] --> S1{Uncertainty language?<br/>might, possibly, likely...}
    Text --> S2{Hallucination patterns?<br/>'I have access to'<br/>'according to my records'}
    Text --> S3{Multiple percentages<br/>without citations?}
    Text --> S4{Long text<br/>with no citations?}
    Text --> S5{Overly precise $ figures<br/>without sources?}

    S1 -->|−5 each, cap −25| Score[Confidence Score 0-100]
    S2 -->|−25 each + flag| Score
    S3 -->|−15| Score
    S4 -->|−10| Score
    S5 -->|−10 + flag| Score

    Score --> Level{Level}
    Level -->|≥80| High[✅ high]
    Level -->|60-79| Med[⚠️ medium]
    Level -->|40-59| Low[🔍 low]
    Level -->|<40| Crit[🚨 critical]

    style Text fill:#e1f5fe
    style Score fill:#fff9c4
    style High fill:#c8e6c9
    style Crit fill:#ffcdd2
```

## Fact Checker — Claim Extraction & Verification

```mermaid
graph TB
    Input[Text] --> Extract[Extract Claims]
    Extract --> Dollars[💲 Dollar amounts]
    Extract --> Percents[％ Percentages]
    Extract --> Dates[📅 Dates]

    Dollars --> Verify1{Compare vs<br/>grant max in Reference DB}
    Dates --> Verify2{Match verified<br/>deadline?}
    Percents --> Verify3[No source → unverified]

    Verify1 -->|Over max| Conflict[❌ conflict · high severity]
    Verify1 -->|Within range| Verified[✅ verified · low severity]
    Verify2 -->|Match| Verified
    Verify2 -->|No match| Unverified[❓ unverified · medium]
    Verify3 --> Unverified

    Verified --> Rate[Verification Rate %]
    Conflict --> Rate
    Unverified --> Rate

    classDef data fill:#fce4ec
    classDef good fill:#c8e6c9
    classDef bad fill:#ffcdd2

    class Verified good
    class Conflict bad
```

## Risk / Accuracy Scoring

```mermaid
graph LR
    Conf[Confidence Score] --> Calc[calculateRisk]
    Verif[Verification Rate] --> Calc
    Conflicts[Factual Conflicts] --> Calc
    Halluc[Hallucination Patterns] --> Calc

    Calc -->|+15 if ≥80% verified| Adjust[Adjusted Score]
    Calc -->|+10 if ≥60% verified| Adjust
    Calc -->|−15 per conflict| Adjust

    Adjust --> Verdict{Final Level}
    Verdict --> H[✅ high · green<br/>Safe to use]
    Verdict --> M[⚠️ medium · yellow<br/>Verify key facts]
    Verdict --> L[🔍 low · orange<br/>Independent check]
    Verdict --> Cr[🚨 critical · red<br/>Do NOT use as-is]

    style H fill:#c8e6c9
    style M fill:#fff9c4
    style L fill:#ffe0b2
    style Cr fill:#ffcdd2
```

## Application Pages

```mermaid
graph TD
    Root[App.tsx<br/>React Router] --> P1["/ · Landing<br/>Hero, features, CTA"]
    Root --> P2["/demo · Demo<br/>Paste text + sample buttons<br/>→ AnalysisResults"]
    Root --> P3["/dashboard · Dashboard<br/>Stats + recent history"]
    Root --> P4["* · NotFound (404)"]

    P2 --> API1[POST /api/analyze]
    P3 --> API2[GET /api/history]

    style Root fill:#fff3e0
    style P1 fill:#e1f5fe
    style P2 fill:#f3e5f5
    style P3 fill:#e8f5e8
```

## Example — Catching a Hallucination

```mermaid
graph TD
    A["Input: 'I have access to your university database and can<br/>confirm the research grant maximum is $50,000.<br/>The deadline has been extended to April 30, 2026.'"] --> B[Confidence Analyzer]
    B --> C["Detects: 'I have access to' + 'I can confirm'<br/>→ −25 each, flag raised"]
    C --> D[Fact Checker]
    D --> E["$50,000 vs verified max $25,000<br/>→ ❌ CONFLICT (high severity)<br/>April 30 2026 ≠ verified March 15 2026 → unverified"]
    E --> F[Risk Scorer]
    F --> G["🚨 CRITICAL<br/>'Likely contains hallucinations or false information'<br/>Recommendation: Do NOT use without verification"]

    style A fill:#e1f5fe
    style C fill:#ffe0b2
    style E fill:#ffccbc
    style G fill:#ffcdd2
```

## Data Model (Backend Response)

The backend returns a rich `AnalysisResponse` normalized by `toArosAnalysis()`:

| Section | Key Fields |
|---|---|
| **accuracy** | `accuracy_score`, `level`, `label`, `color`, `emoji`, `recommendations`, `breakdown` |
| **confidence** | `score`, `level`, `factors[]`, `flags[]`, `analysis{word_count, has_citations, hallucination_patterns, uncertainty_count}` |
| **fact_checks** | `results[]`, `verified_count`, `conflict_count`, `verification_rate`, `conflicts[]`, `is_fictional`, `content_type` |
| **summary** | `score`, `label`, `emoji`, `overall_assessment`, `claims_verified/conflicted/unverified/total`, `recommendations` |

## Reference Database (Ground Truth)

Fact checking is grounded against a small curated dataset (`src/lib/referenceDatabase.ts`):

```
university_grants   → deadline: March 15, 2026 · max_award: $25,000
verified_statistics → AI adoption 2025 (67%) · global AI market ($190B, 2025)
common_facts        → Python (Guido van Rossum, 1991) · JavaScript (Brendan Eich, 1995)
```

## Installation

### Prerequisites
- Node.js 18+ (or **Bun** — the repo ships `bun.lock`)
- Access to the AROS backend API

### Step 1: Install Dependencies
```bash
# with npm
npm install

# or with bun
bun install
```

### Step 2: Configure the Backend URL
Create a `.env` file (see `.env.example`):
```bash
VITE_API_URL=https://rithanya918-aros.hf.space
```

### Step 3: Run the App
```bash
npm run dev        # start Vite dev server
npm run build      # production build
npm run preview    # preview the build
npm run lint       # run ESLint
npm run test       # run Vitest unit tests
```

Then open the local URL Vite prints (default `http://localhost:5173`).

## Deployment Architecture

```mermaid
graph TB
    subgraph Frontend[Frontend]
        Vite[Vite / React build]
        Static[Static bundle]
        Vite --> Static
    end

    subgraph Backend[Hugging Face Space]
        API[AROS API<br/>/api/analyze · /api/history · /api/health]
        GPT[GPT-4o reliability engine]
        API --> GPT
    end

    Users[Users] --> Static
    Static -->|fetch VITE_API_URL| API

    classDef fe fill:#f3e5f5
    classDef be fill:#e8f5e8
    classDef ext fill:#e1f5fe

    class Vite,Static fe
    class API,GPT be
    class Users ext
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/analyze` | Analyze a block of text → full `AnalysisResponse` |
| `GET`  | `/api/history?limit=N` | Recent analyses, hallucination count, avg score |
| `GET`  | `/api/health` | Backend + fact-checking status |

## Project Structure

```
AROS/
├── src/
│   ├── pages/          Landing · Demo · Dashboard · NotFound
│   ├── components/     Navbar · AnalysisResults · RiskBadge · NavLink · ui/
│   ├── lib/
│   │   ├── arosEngine.ts          orchestrates local analysis
│   │   ├── confidenceAnalyzer.ts  linguistic risk signals
│   │   ├── factChecker.ts         claim extraction + verification
│   │   ├── riskScorer.ts          combines into final verdict
│   │   ├── referenceDatabase.ts   ground-truth facts
│   │   └── api.ts                 backend client + types
│   ├── hooks/          use-mobile · use-toast
│   └── assets/         model logos (ChatGPT, Claude, Gemini, ...)
├── public/
├── package.json · vite.config.ts · tailwind.config.ts
└── playwright.config.ts · vitest.config.ts
```

## Limitations

- Fact checking is bounded by a **small curated reference database** — claims outside it return "unverified"
- Confidence scoring uses **heuristic pattern matching**, not semantic understanding, on the client side
- Verification currently focuses on **dollar amounts, percentages, and dates**
- The hosted backend (Hugging Face Space) may cold-start or rate-limit on the free tier
- No user authentication or persistent per-user accounts

## 📄 License

Demonstration / educational project.

---
