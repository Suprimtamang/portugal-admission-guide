# Feature Research — Portugal Admission Guide

**Date:** 11 August 2026
**Companion to:** `docs/product-plan.md` (purpose, audience, market, phased roadmap)
**Question answered here:** *what features would actually make this application better, and which are worth building first?*

---

## 1. Method

Three inputs:

1. **Code audit** — what the app can already do (6 seeded steps, 4 checklist items, 1 wizard, 1 email template).
2. **Domain research** — DGES rules, the CNA calendar, Artigo 20.º-A, equivalency law, and the tuition regime, verified against official sources (listed at the end).
3. **Data feasibility check** — for every proposed feature, whether the underlying data actually exists and is obtainable.

The filter applied throughout: *does this feature answer a question the user cannot answer anywhere else in English?* Anything that fails that filter is listed in §6, "what not to build."

---

## 2. The value the app is sitting on — quantify it, then build around it

This is the finding that should shape the entire feature set.

| | National student | International student |
|---|---|---|
| Annual tuition, licenciatura (public) | up to **€697** (legal band €560–697) | **€4,500** (IGOT-ULisboa) to **€7,500** (ULisboa, from 2025/26) |
| 3-year licenciatura, total | **~€2,091** | **~€13,500 – €22,500** |

**Getting a user through the national door is worth €11,000–€20,000 to them.** CPLP nationals can get up to a 45% reduction on the international rate, which narrows but does not close the gap.

Nothing in the app currently says this. Every high-value feature below is a variation on the same theme: *help the user prove they belong on the left column, and help them not waste the chance once they do.*

---

## 3. Feature opportunity areas

Five areas, ordered by value. Each lists the evidence, what to build, and feasibility.

---

### Area A — Eligibility & money: "which door am I in?"

**Evidence.** The current wizard is two checkboxes whose result is never stored, never branches anything, and produces nothing at all for a user who checks neither. The rules themselves are more nuanced than the app shows: the 2-year test is "legally resident, uninterrupted, **as of 1 January** of the enrolment year," while family members of Portuguese/EU/EEA nationals qualify **regardless of nationality and with no 2-year wait** — a different test with a different answer.

**Features:**

- **A1 — Fee-gap calculator.** Input: intended course type + institution. Output: "As a national student you would pay ~€697/year. As an international student, €4,500–7,500. Over a 3-year degree that is a **€11,400–€20,400 difference**." This single number is the app's entire motivation, and it is currently invisible. *Effort: S. Impact: very high.*
- **A2 — Real eligibility decision tree.** Replace the checkbox pair with a branching interview (nationality, residence permit type, start date, family situation, CPLP status) producing one of four outcomes: **national route** / **international route** / **borderline — verify** / **not yet eligible**. Persist the result on the profile and use it to filter every downstream step. *Effort: M. Impact: very high.*
- **A3 — "Not yet eligible" year calculator.** If the user needs more residence time, compute the first 1 January at which they clear the threshold and therefore the first intake they can target. This converts a dead end into a two-year plan — and is exactly the moment an account becomes worth creating. *Effort: S. Impact: high.*
- **A4 — Borderline case → pre-written BE-COM ticket.** For ambiguous cases (notably time on a study visa, which DGES does not address publicly), generate the exact Portuguese wording to submit to the DGES e-balcão, pre-filled with the user's situation. Turns the app's biggest knowledge gap into its most useful output. *Effort: S. Impact: high.*

---

### Area B — The exam substitution engine (the most under-served, highest-leverage area)

**Evidence.** Step 3 is the app's self-declared "secret," yet it is the weakest step: it gives an email template to CNAES and omits every qualifying condition. Research surfaced four facts the app never mentions:

1. A foreign exam substitutes only if it is **national in scope**, **homologous** to the required prova de ingresso, and scored **≥95 of 200**.
2. **CNAES publishes the approved foreign-exam list annually by 31 May.** Whether a given country's board exam is accepted is a *lookup*, not a guess.
3. Exams sat from 2022 onward are **valid for 5 years**.
4. There is a **second route the app omits entirely**: skip substitution and sit the Portuguese national exams. Some users are better off doing this.

**Features:**

- **B1 — Searchable approved-exam directory, by country.** "I did the CBSE Class 12 / ENEM / NEB Nepal / WAEC — is it accepted, and for which prova de ingresso?" Sourced from the annual CNAES deliberation. **No English-language tool does this.** Strongest candidate for the app's signature feature and its organic-search magnet. *Effort: M (data entry is the cost). Impact: very high.*
- **B2 — Substitution eligibility checker.** Walk the four conditions against the user's actual exam and score, and return a verdict plus the missing piece. Prevents users burning months on a request that fails on a criterion nobody told them about. *Effort: S–M. Impact: very high.*
- **B3 — The national-exam fallback path.** Document the "sit the Portuguese provas de ingresso instead" route, with its own calendar and registration steps, and recommend between the two based on the B2 verdict. *Effort: M. Impact: high.*
- **B4 — Correct the submission route.** The request goes to DGES, online via the portal or in person at a GAES — not by email to CNAES. The Portuguese letter stays, relabelled as a supporting document. *Effort: XS. Impact: high (accuracy).*

---

### Area C — Score simulator & course matcher (the retention engine)

**Evidence.** DGES publishes, per course per institution, everything needed to build this — verified on a live course page (`dges.gov.pt/guias/detcursopi.asp?codc=L224&code=1105`):

> vacancies (284 for 2026-27) · required provas de ingresso · **weights (média 50% / provas 50%)** · minimum application score (140) · minimum exam score (140) · applicant and placement counts by phase · **last-admitted score per year and phase, 2023–2025**

The legal weighting bands are fixed: secondary average **≥40%**, entrance exams **≥45%**, prerequisites **≤15%**, and the secondary weight may never exceed the exam weight. Grade conversion from foreign scales is governed by **Portaria n.º 224/2006** and **Portaria n.º 699/2006** — i.e. it is a published formula, not a black box.

**Features:**

- **C1 — Nota de candidatura simulator.** `(média × peso) + (provas × peso) + (pré-requisitos × peso)`, using each course's real published weights. Portuguese students have half a dozen of these calculators; **immigrants have none that start from a foreign qualification.** *Effort: M. Impact: high.*
- **C2 — Foreign-grade conversion helper.** Estimate the 0–20 / 0–200 equivalency result from the user's home-country scale before they queue at a secondary school. Manages expectations at the exact point where users are most often blindsided. Must be labelled an **estimate** — the school's decision is binding. *Effort: M. Impact: high.*
- **C3 — "Courses you can realistically get into."** Match the simulated score against per-course minimums and the 2023–2025 last-admitted history. Output a **safe / target / reach** ladder. *Effort: L (needs a course dataset). Impact: very high.*
- **C4 — Six-choice optimiser.** The CNA lets you rank six options; ordering them badly is a common and costly mistake. Build the ladder from C3 and flag risky lists ("all six are reach choices"). *Effort: M on top of C3. Impact: high.*

*Feasibility note:* the DGES guias pages are per-course HTML and scrapable, but this is public-body data — cache it once per admission cycle, attribute it, and link back to the official page on every course. Treat DGES as the authority and the app as an index over it.

---

### Area D — Deadlines & document operations (what makes an account worth having)

**Evidence.** The app contains **no dates at all**, despite the whole problem being a scheduling one. The 2026 calendar (Despacho n.º 9359-A/2026): 1st phase 20 July–6 August, results 23 August, enrolment 24–27 August; 2nd phase 24 August–20 September; 3rd phase 10–12 October. Equivalency is legally decided within 30 days of a *complete* file but routinely runs far longer — so the real advice is to start the previous winter.

**Features:**

- **D1 — Backward planner.** User picks a target intake; the app derives personal start-by dates for each step and shows a live countdown. The one feature that reframes the product from encyclopaedia to plan. *Effort: M. Impact: very high.*
- **D2 — Document tracker.** Each certificate moves through **obtained → attested → apostilled/legalised → translated → submitted**. This is how Step 1 is actually experienced; a flat checklist of 4 items does not model it. *Effort: M. Impact: high.*
- **D3 — Translation-cost guard.** Foreign documents need certified Portuguese translation **only if they are not in English, French or Spanish**. The app currently tells every user to get translations — advice that can cost several hundred euros unnecessarily. *Effort: XS. Impact: high — the fastest money-saving fix in the codebase.*
- **D4 — Milestone reminders by email.** Tied to D1. The only durable reason to keep an account. *Effort: M. Impact: high.*
- **D5 — Printable pack.** A one-page PT/EN checklist to hand to a parent, a school secretary, or a GAES counter. *Effort: S. Impact: medium — but disproportionately good for word-of-mouth.*

---

### Area E — Trust, language and reach

**Evidence.** Zero citations and zero "last verified" dates on quasi-legal guidance. Lisbon-only addresses (one school, two GAES offices). No Portuguese version — despite the audience needing PT wording at the counter, which the app's own PT email template implicitly concedes.

**Features:**

- **E1 — Sources + `verified_at` per step**, rendered in the UI. Prerequisite for everything else; see `product-plan.md` Phase 0. *Effort: S. Impact: very high.*
- **E2 — Bilingual PT/EN with side-by-side counter mode.** Show the English explanation and the Portuguese phrase to actually say or hand over. *Effort: M–L. Impact: high.*
- **E3 — Regional directory.** Model schools and GAES offices as data with district/city, and let the user pick their region. Currently a Porto or Faro user gets addresses they cannot use. *Effort: M. Impact: high.*
- **E4 — Country playbooks** for the largest origin groups (Brazil, India, Nepal, Bangladesh, Angola, Cabo Verde, Ukraine): apostille vs consular legalisation differs materially by country, as does the exam that goes into B1. Also the app's best organic-search surface — one indexable page per country. *Effort: L, incremental. Impact: high.*
- **E5 — "What happened next" outcomes.** A single post-August question ("did you get placed?") is the only way this project will ever know whether it works. *Effort: S. Impact: medium — but it is the app's only outcome metric.*

---

### Area F — AIMA & proof of legal residence (the missing prerequisite)

**Evidence.** This is the largest single gap found in the whole audit. The eligibility rule is not self-certified — it must be **documented**:

> Non-EU applicants must submit a **declaration issued by AIMA** attesting legal residence in Portugal for more than two uninterrupted years as of 1 January of the application year.

The app's Step 0 asks the user to tick a checkbox about the 2-year rule and then moves on. **It never tells them they have to go and obtain the document that proves it.** That is the difference between believing you qualify and being able to apply.

This matters more than it sounds, because AIMA is severely backlogged: roughly **100,000 cases under review and a further 133,000 pending**, with standard family-reunification decisions running to ~9 months. AIMA has responded with expanded online renewals and **interim proof-of-approval documents for delayed cases**. So a user can be legally resident, be *entitled* to national-student status, and still be unable to produce the paper in July.

A second nuance, and a genuinely dangerous one: **the reference date is not universal.** DGES's national-contest rule uses **1 January** of the enrolment year. ULisboa's international-student contest uses **31 August**. A user sitting near the two-year boundary can be classified differently by the two systems, and the app currently presents a single date as if it were the only one.

Permit type matters too: AIMA art. 91.º and art. 92.º are the higher-education **student** residence permits — the same category the app's unsourced "study visa time usually doesn't count" claim is about. This is where that claim must be resolved.

**Features:**

- **F1 — "Get your AIMA proof" as a first-class step.** Promote it to its own roadmap step with its own lead time, ahead of Step 1. Currently missing entirely, and it is a hard prerequisite for the whole national route. *Effort: S. Impact: very high — the biggest single omission in the app.*
- **F2 — Permit-type input in the eligibility tree (A2).** Ask which permit the user holds (family reunification, work, art. 91/92 student, permanent, CPLP) and branch on it, rather than asking them to self-assess. *Effort: S on top of A2. Impact: high.*
- **F3 — Backlog contingency guidance.** What to do when the card is expired or renewal is pending on 1 January: interim proof-of-approval documents, comprovativo de pedido, and a BE-COM ticket (A4) to have the situation assessed in advance rather than at the counter in August. *Effort: S. Impact: high — addresses the most common real-world blocker.*
- **F4 — Dual-date eligibility check.** Evaluate the user against **both** 1 January (CNA) and 31 August (institutional contests), and flag boundary cases explicitly. *Effort: S. Impact: high — prevents a confident wrong answer.*

*Scope discipline:* the app should help users **document residence they already have**. It should not advise on obtaining, changing or renewing residency — that is immigration law, a different liability class, and well covered elsewhere. Link to AIMA and stop.

---

### Area G — University-level requirements (where the roadmap currently stops too early)

**Evidence.** The app ends at "submit your top 6 choices." Real admission has gates past that point, and the parallel international route has its own, much earlier, calendar.

1. **Language.** Portuguese-taught programmes generally require **B1–B2** Portuguese (ULisboa: B1 to attend, or English proficiency for English-taught programmes; several institutions require B2, some admitting at B1 conditional on enrolling in a language course). The app mentions language **nowhere**.
2. **The international route runs months earlier.** ULisboa's international-student contest for 2026/27: **Phase 1 2 Jan – 6 Feb**, Phase 2 **6 Apr – 22 May**, Phase 3 to 30 September. The CNA 1st phase is 20 July – 6 August. A user told in July that they are *not* eligible for the national route has **already missed** the first two international phases. The app's dead-end wizard is therefore not just unhelpful — it is expensive.
3. **Prerequisites** (pré-requisitos) apply to specific courses and carry up to 15% of the application score.
4. **Country-specific institutional routes exist** — e.g. ULisboa admits Brazilian applicants on **ENEM** scores from the three preceding years.
5. Requirements are **per-institution**, not national — Porto, Lisboa, Leiria and IPL all publish their own.

**Features:**

- **G1 — Language-requirement checker.** Per course/institution: required level, whether the programme is taught in English, and where to certify (CAPLE/CIPLE). *Effort: M. Impact: high — an unflagged gate today.*
- **G2 — Parallel international-route track with its own calendar.** The "not eligible" branch of A2 must land somewhere real, with the January/April deadlines front and centre. *Effort: M. Impact: very high — turns the worst user outcome into a usable one.*
- **G3 — Institution requirement profiles.** Model per-institution admission rules (language level, contest phases, contact address, country-specific routes) as data alongside the DGES course dataset in C3. *Effort: L. Impact: high.*
- **G4 — Prerequisite flagging.** Warn when a chosen course carries pré-requisitos, which must be satisfied before the application, not after. *Effort: S on top of C3. Impact: medium–high.*
- **G5 — Post-placement steps.** Enrolment windows, and for non-EU students the AIMA art. 91.º/92.º residence-permit route that follows acceptance. Closes the loop the app currently leaves open. *Effort: M. Impact: medium.*

---

## 4. Prioritisation

Impact × confidence ÷ effort, with accuracy fixes forced to the top regardless of score.

### Tier 1 — build first
| Feature | Why now |
|---|---|
| **B4** correct the Artigo 20.º-A submission route | The app currently sends users down a wrong process |
| **D3** translation-cost guard | One paragraph; saves users hundreds of euros |
| **E1** sources + `verified_at` | Nothing else should ship on uncited legal guidance |
| **A1** fee-gap calculator | Makes the app's reason to exist visible; small build |
| **A2** real eligibility decision tree | Everything downstream branches off this |
| **A3** "not yet eligible" year calculator | Converts the app's dead end into a retained user |
| **F1** "get your AIMA proof" as its own step | Hard prerequisite for the national route, currently absent entirely |
| **F4** dual-date check (1 Jan vs 31 Aug) | Prevents a confident wrong answer on boundary cases |
| **G2** international route with its own calendar | Users told "not eligible" in July have already missed two phases |

### Tier 2 — the differentiators
| Feature | Why |
|---|---|
| **B1** approved foreign-exam directory by country | The signature feature; no English-language equivalent exists |
| **B2** substitution eligibility checker | Prevents the most expensive failure mode |
| **D1** backward planner + countdown | Turns the guide into a plan |
| **D2** document tracker | Models the real workflow; makes accounts worthwhile |
| **A4** pre-written BE-COM ticket | Best possible answer to genuine uncertainty |
| **F2** permit type as an eligibility input | Stops asking users to self-assess a legal test |
| **F3** AIMA backlog contingency | Addresses the most common real-world blocker |
| **G1** language-requirement checker | An unflagged admission gate today |

### Tier 3 — the growth engine
| Feature | Why |
|---|---|
| **C1** nota de candidatura simulator | High engagement, well-defined formula |
| **C2** grade conversion helper | Sets expectations before the school visit |
| **C3** course matcher with historical cutoffs | Highest ceiling; needs the DGES dataset first |
| **E3** regional directory | Unblocks every non-Lisbon user |
| **E2** bilingual PT/EN | Doubles reach; makes the app usable *at the counter* |

### Tier 3 (cont.) — the growth engine
| Feature | Why |
|---|---|
| **G3** institution requirement profiles | Natural companion to the DGES course dataset |

### Tier 4 — later
**C4** six-choice optimiser · **B3** national-exam fallback path · **G4** prerequisite flagging · **G5** post-placement steps · **E4** country playbooks · **D4** reminders · **D5** printable pack · **E5** outcome survey

---

## 5. Recommended MVP feature set

Tier 1 in full, plus **B1** and **D1**.

Tier 1 now reads as one continuous decision: *which door am I in (A2, F2) → am I sure, given the two different reference dates (F4) → what is it worth (A1) → what do I do if the answer is no (A3, G2) or not yet (A3) → what document proves it and how long will AIMA take (F1) → does my exam qualify (B1) → when must I start (D1)?*

Everything in Tier 3 is an upgrade on a product that already works. Nothing in Tier 3 rescues one that doesn't.

---

## 6. What **not** to build

| Rejected | Reason |
|---|---|
| General "study in Portugal" content | Commoditised, heavily contested by agencies with budgets, and it dilutes the one niche the app owns |
| Immigration advice — how to obtain, change or renew residency | Different legal domain and liability class, well covered by immigration-law firms. **Note the boundary:** helping a user *document residence they already hold* (F1–F4) is core to the product; advising them on *acquiring* residence is not. Link to AIMA and stop |
| Private university coverage | Different process (institutional, not CNA) — a separate product |
| An AI chatbot over the guidance | Confident wrong answers on legal deadlines is the worst possible failure for this audience; a wrong chatbot answer costs a user a year |
| Document uploads | Certificates and residency papers are sensitive personal data. Track **status flags** only, unless a proper data-protection review is done first |
| Scraping DGES for live application status | Depends on user credentials — never build this |

---

## 7. Data feasibility summary

| Data needed | Source | Obtainable? |
|---|---|---|
| Per-course provas, weights, minimums, vacancies, 2023–25 cutoffs | `dges.gov.pt/guias/detcursopi.asp` (per course) + `indcurso.asp` index | **Yes** — HTML, scrapable, refresh once per cycle |
| CNA calendar | Annual Despacho (2026: n.º 9359-A/2026) | **Yes** — annual manual update, store as data |
| Approved foreign exams by country | Annual CNAES deliberation, published by 31 May | **Yes** — annual PDF, needs manual extraction |
| Foreign-grade conversion tables | Portaria n.º 224/2006 · Portaria n.º 699/2006 | **Yes** — published formulas |
| Tuition fees | Per-institution deliberations (national capped at €697; international set per faculty) | **Partly** — national is a single legal cap; international needs per-institution entry |
| Historical placement statistics 1997–2025 | DGES Estatísticas / Infocursos | **Yes** |
| Per-course cutoffs as clean open data | `dados.gov.pt` | **No** — education datasets exist but not per-course cutoffs; scraping the guias remains necessary |
| AIMA proof-of-residence procedure, permit types (art. 91.º/92.º, art. 80.º) | `aima.gov.pt` — Estudar / Viver / Impressos e Minutas | **Yes** — public pages and downloadable forms; link out, do not replicate |
| Institutional international-contest rules, phases, language levels | Per-university pages (ULisboa, UPorto, IPL, IPLeiria …) | **Yes** — manual per-institution entry; start with the 5–10 largest |
| AIMA caseload / backlog context | AIMA reporting and press coverage | **Partly** — directional only; do not present as a service-level promise |

---

## Sources

- [Guia da Candidatura — Acesso ao Ensino Superior 2026, Ensino Superior Público (DGES)](http://www.dges.gov.pt/guias/pdfs/GuiaCandPub2026.pdf)
- [Índices de Cursos 2026 (DGES)](http://www.dges.gov.pt/guias/indcurso.asp)
- [Exemplo de detalhe de curso — Eng. Informática e Computação, FEUP (DGES)](https://www.dges.gov.pt/guias/detcursopi.asp?codc=L224&code=1105)
- [Estudantes com ensino secundário estrangeiro (DGES)](https://www.dges.gov.pt/en/node/172)
- [Substituição de provas de ingresso por exames estrangeiros — Artigo 20.º-A (DGES)](https://www.dges.gov.pt/pt/pagina/substituicao-de-provas-de-ingresso-por-exames-estrangeiros-artigo-20o)
- [Calendário do Concurso Nacional de Acesso 2026 (DGES)](https://www.dges.gov.pt/pt/pagina/calendario-concurso-nacional-de-acesso-0)
- [Condições de acesso e ingresso no ensino superior — FAQ (DGES)](https://www.dges.gov.pt/pt/faq/condicoes-de-acesso-e-ingresso-no-ensino-superior)
- [Conversão de Classificação Final para a Escala Portuguesa (DGES)](https://www.dges.gov.pt/pt/pagina/conversao-de-classificacao-final-para-escala-portuguesa)
- [FAQ — Equivalências de Habilitações Estrangeiras (Direção-Geral da Educação)](https://www.dge.mec.pt/faq-equivalencias-de-habilitacoes-estrangeiras)
- [Estatísticas do Concurso Nacional de Acesso (DGES)](https://www.dges.gov.pt/pt/pagina/estatisticas)
- [Propinas em Portugal 2026 — públicas e privadas (tesify)](https://tesify.pt/propinas-portugal-2026-quanto-custa-universidades-publicas-privadas/)
- [Propinas e Emolumentos — IGOT-ULisboa](https://www.igot.ulisboa.pt/propinas-e-emolumentos)
- [Funcionamento e Propinas — Universidade do Porto](https://www.up.pt/portal/pt/estudar/licenciaturas-e-mestrados-integrados/funcionamento-e-propinas/)
- [Como se calcula a média de acesso ao ensino superior — Doutor Finanças](https://www.doutorfinancas.pt/vida-e-familia/acesso-ensino-superior/)
- [Educação, Ciência e Tecnologia — dados.gov.pt](https://dados.gov.pt/en/topics/educacao-ciencia-e-tecnologia/datasets)

### AIMA & residence
- [Autorização de Residência para Estudantes — Art. 92.º (AIMA)](https://aima.gov.pt/pt/estudar/autorizacao-de-residencia-para-estudantes-art-92-o)
- [Autorização de Residência a Estudantes do Ensino Superior — Art. 91.º (AIMA)](https://aima.gov.pt/pt/estudar/autorizacao-de-residencia-emitida-a-estudantes-do-ensino-superior-art-o-91)
- [Autorização de Residência Permanente — Art. 80.º (AIMA)](https://aima.gov.pt/pt/viver/autorizacao-de-residencia-permanente-art-80-o)
- [Impressos e Minutas (AIMA)](https://aima.gov.pt/pt/impressos-e-minutas)
- [AIMA rejects 78,000 immigration applications — caseload context](https://portugaldecoded.substack.com/p/aima-rejects-78000-immigration-applications)
- [Family reunification in Portugal in 2026: what has changed](https://lamarescapela.pt/en/knowledge/family-reunification-in-portugal-in-2026-what-has-changed/)

### Institutions
- [Access and Admission in ULisboa — 1st and 2nd Cycles](https://www.ulisboa.pt/en/info/access-and-admission-ulisboa-1st-and-2nd-cycles)
- [Special Call for Applications — International Students (Universidade do Porto)](https://www.up.pt/portal/en/study/international-students/special-call-for-applications/)
- [Entrance Requirements (Politécnico de Lisboa)](https://www.ipl.pt/en/international/international-student/entrance-requirements)
- [International Applicants (Politécnico de Leiria)](https://www.ipleiria.pt/en/study/applications/undergraduate-applications/international-applicants/)
- [Matrículas 2026/2027 — Concurso Nacional de Acesso (Universidade do Algarve)](https://www.ualg.pt/matriculas-20262027-concurso-nacional-de-acesso)
