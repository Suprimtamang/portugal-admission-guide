# Portugal Admission Guide — Product Research & Improvement Plan

**Date:** 11 August 2026
**Status of app reviewed:** local only (`http://portugal-admission-guide.test`), Laravel + Inertia + React, 6 seeded roadmap steps, 4 checklist items total, auth + progress persistence.

---

## 1. What this application actually is

Read from the code, not the pitch:

| Layer | Reality |
|---|---|
| Content | 6 hardcoded steps seeded in `database/seeders/RoadmapSeeder.php` (153 lines). All content lives in one seeder + a `meta` JSON blob per step. |
| Rendering | One route (`/`) renders all 6 steps; the active step is React `useState`, not a URL. |
| Interactivity | 1 eligibility wizard (2 checkboxes), 1 checklist (4 items), 1 copyable email template, 3 static info panels. |
| Accounts | Full Breeze auth (register, login, verify, reset, profile) — used to persist exactly 4 checkbox states. |
| Distribution | Not deployed. No domain, no analytics, no sitemap, one generic `<title>`, no meta description, no OG tags. |

It is a **well-executed single-page explainer with a database behind it** — currently closer to the `_legacy/index.html` it replaced than to a product.

---

## 2. Purpose — the real job to be done

The app exists because Portuguese higher-education admission has a **hidden second door**, and almost nobody documents it in English.

- Foreign nationals in Portugal are, by default, funnelled into the **Estatuto do Estudante Internacional** (Decreto-Lei n.º 62/2018) — the international student route, run per-institution, with tuition often **3–8× higher** than the national rate.
- But under the same law, a foreign national who has **resided legally in Portugal for more than 2 uninterrupted years as of 1 January** of the enrolment year is **not** an international student, and applies through the **Concurso Nacional de Acesso** (CNA) at national-student fees.
- Family members of Portuguese/EU nationals qualify **regardless of nationality and without the 2-year period**.

**The job:** *"I already live in Portugal. Tell me, in a language I read, whether I can pay national fees — and give me the exact bureaucratic sequence to prove it, in the right order, before the deadlines."*

The financial stake per user is in the **thousands of euros per year**. That is the product's entire reason to exist, and the current homepage never states it.

---

## 3. Target audience

### Primary segment
Immigrants aged 16–22 (and their parents) already legally resident in Portugal, holding a **non-Portuguese secondary school certificate**, applying to public university.

Sub-segments, in order of size and pain:
1. **Family-reunification teens** — arrived with a parent, PT residence card, foreign Grade 10/12 certificates. Highest volume, lowest institutional knowledge, often the family's only fluent English/Portuguese speaker.
2. **Long-resident workers' children** — 2+ years resident, may have partial Portuguese schooling.
3. **Adult career-changers** — resident immigrants returning to study, need equivalency for an old foreign diploma.
4. **The parent, not the student** — frequently the actual reader and decision maker; often reads neither English nor Portuguese well.

### Market size (verified)
- Portugal's foreign resident population reached **~1.55 million (end 2024)**, ≈15% of the total population, up 48% year on year.
- AIMA issued a record **~386,000 residence permits in 2025**.

Even a conservative slice — teens in a resident immigrant family reaching university age each year — is a **five-figure annual addressable audience**, growing fast, and concentrated in Lisbon/Setúbal, Porto, Braga, Faro and Algarve.

### Secondary audiences (currently unserved, low effort to add)
- **School and GAES counsellors** who field these questions repeatedly and have no English handout.
- **Immigrant support NGOs** and parish/municipal integration desks.

---

## 4. Competitive landscape

Searched the space. The gap is real and specific.

| Who | What they cover | The gap |
|---|---|---|
| DGES official site | Authoritative, complete | Portuguese-first, legalistic, split across a dozen pages, assumes you know which regime you're in |
| "Study in Portugal" blogs & agencies | English, polished, high SEO | **Aimed at people applying from abroad as international students.** They actively route readers into the expensive door |
| Immigration law/visa sites | Residency, AIMA, D-visas | Stop at the residence permit; say nothing about university access |
| Facebook/WhatsApp community groups | Real lived experience | Unsearchable, undated, contradictory, frequently wrong |

**Nobody owns "I already live here — can I pay national fees?"** That is a defensible niche with strong search intent and near-zero English-language competition.

---

## 5. How is it doing?

**Honest answer: unmeasurable, and that is itself the finding.**

No analytics, no deployment, no public URL, no indexable pages. There is no data to assess, and the app is currently structurally incapable of being found by the audience it describes.

### What is genuinely good
- Clean information architecture — the 6-phase sequence matches the real bureaucratic order.
- Content is DB-driven (`roadmap_steps.meta` JSON), so it can grow without a rewrite.
- Sensible polymorphic step-body pattern (`StepBody` switch on `meta.type`).
- Guests get full content; auth is additive, not a wall. Correct call.
- Auth, profile and progress-toggle all have feature tests.

### Critical problems

#### A. Accuracy and liability — highest priority
This app gives quasi-legal administrative guidance with **zero citations and zero "last verified" dates**. Specific issues found:

1. **Step 3 describes the wrong process.** The app tells users to email a template to `cnaes@dges.gov.pt`. The official Artigo 20.º-A route is a **formal request to DGES, submitted online via the DGES portal or in person at a GAES** — not an email to CNAES.
2. **Step 3 omits the eligibility bar entirely.** Substitution requires the foreign exam to be of **national scope**, in a **homologous discipline** to the required prova de ingresso, with a **minimum 95 points on a 0–200 scale**. A user following the app today can spend months and be rejected on a criterion never mentioned.
3. **The study-visa claim is unsourced.** Step 0 asserts time on a study visa "usually doesn't count" toward the 2-year rule. DGES's own FAQ does not state this. This is the single highest-stakes sentence in the app and it is presented as fact without a source.
4. **The family-reunification rule is conflated.** The app frames it as "my parent has lived here legally >2 years." DGES frames the exemption as family members of **Portuguese/EU/EEA nationals**, regardless of nationality and **without** the 2-year requirement. These are different tests with different outcomes.
5. **No deadlines anywhere.** The entire product is a scheduling problem and it contains no dates. The 2026 CNA calendar (Despacho n.º 9359-A/2026):
   - 1st phase: **20 July – 6 August 2026** (priority candidates 20–29 July); results **23 August**; enrolment **24–27 August**
   - 2nd phase: **24 August – 20 September**; results **30 September**; enrolment **1–3 October**
   - 3rd phase: **10–12 October**; results **18 October**; enrolment **18–20 October**

   Equivalency is legally decided within 30 days of a complete file but in practice runs far longer — which means the real advice is **start in the previous winter**. The app says "March/April" in a tip and nowhere else.
6. **Lisbon-only.** One named school (Laranjeiras), two GAES offices (ISCTE, ULisboa). Porto, Braga, Coimbra, Faro, Açores and Madeira users get addresses they cannot use.
7. **Support contact is a personal student email** (`s.tamang@campus.fct.unl.pt`), hardcoded in `RoadmapController`. It is a single point of failure and expires on graduation.

#### B. The product under-delivers on its own promise
- **Auth earns almost nothing.** Only `attestation` has checklist items — 4 in total. Steps 0, 2, 3, 4, 5 have **zero**. "Register to save your progress" currently means saving 4 checkboxes.
- **The eligibility wizard is a dead end.** Its answer is not stored, does not change any downstream step, and a user who checks neither box is simply abandoned — no message, no alternative route, no "here is the international student path instead."
- **No document tracking.** The audience's actual pain is a folder of certificates in three states of legalisation. The app lists documents but tracks nothing.
- **No dates, no reminders.** See above. This is the one feature that would make accounts worth creating.

#### C. Findability — currently zero
- Every step lives at `/`. There is no `/step/equivalency` URL, so **nothing is linkable, shareable, or indexable**. A user cannot send a friend "the equivalency page."
- One `<title>` for the whole site (`config('app.name')`), no meta description, no Open Graph tags, no `sitemap.xml`.
- No Portuguese version — despite the audience needing PT phrasing to hand to school secretaries and GAES staff. The app already ships a Portuguese email template, which proves the need.

---

## 6. Improvement plan

Ordered by value-per-effort. Phase 0 and 1 are what convert this from prototype to product.

### Phase 0 — Earn trust (do this before anything else)
*Effort: ~2–3 days. Without it, growth just distributes errors faster.*

| # | Action |
|---|---|
| 0.1 | Add `sources` (array of `{label, url}`) and `verified_at` to `roadmap_steps`. Render a "Sources / last verified" footer on every step. Non-negotiable for this content class. |
| 0.2 | Fix Step 3: replace the email-to-CNAES instruction with the real DGES submission route; add the 95/200 minimum, homologous-discipline and national-scope requirements as explicit pre-conditions. Keep the PT template as a *supporting* letter, relabelled. |
| 0.3 | Source or soften the study-visa claim. Either cite a DGES deliberation, or restate it as "commonly reported, not confirmed by DGES — open a BE-COM ticket to confirm your case." |
| 0.4 | Split the family-reunification rule into its two real tests (family of PT/EU national → no 2-year wait; other family reunification → 2-year rule applies). |
| 0.5 | Replace the personal contact email with a project address, moved to config. |
| 0.6 | Add a visible disclaimer: independent guide, not affiliated with DGES, verify with e-balcão. |

### Phase 1 — Become findable (the growth unlock)
*Effort: ~3–5 days.*

| # | Action |
|---|---|
| 1.1 | **Route per step**: `/` + `/step/{slug}`, Inertia-linked, preserving current tab UX. Each step becomes shareable and indexable. |
| 1.2 | Per-step `<title>` and meta description from DB; Open Graph + Twitter card; JSON-LD `HowTo` for the roadmap and `FAQPage` for the eligibility rules. |
| 1.3 | `sitemap.xml` from the steps table; review `robots.txt`. |
| 1.4 | Deploy to a real domain with HTTPS. Nothing above matters until this happens. |
| 1.5 | Add privacy-respecting analytics (Plausible/Umami) — funnel: land → wizard answered → step 3 reached → account created. This is how "how is it doing" becomes answerable. |
| 1.6 | Rewrite the hero to state the payoff in one line: *"Already living in Portugal? You may be able to apply as a national student — and pay national fees."* Currently the money argument is never made. |

### Phase 2 — Make it worth an account
*Effort: ~1–2 weeks.*

| # | Action |
|---|---|
| 2.1 | **Checklist items for all six steps** (currently 4 items total across the app). Target ~30–40 concrete, verb-first items. Biggest single content win available. |
| 2.2 | **Persist the wizard result** on the user profile, and branch the roadmap from it: eligible → national path; not eligible → international-student path with its own steps; borderline → "open a BE-COM ticket, here is the exact wording." Nobody gets dropped. |
| 2.3 | **Deadline engine**: store the CNA calendar per year; show a live countdown, and **back-plan** from the user's target intake ("to make the 1st phase on 6 Aug, start equivalency by ~February"). |
| 2.4 | **Document tracker**: per-document status (obtained → attested → apostilled → translated), which is how the audience actually experiences Step 1. |
| 2.5 | Optional email reminders at the calendar milestones — the only real reason to hold an account. |
| 2.6 | Printable / PDF checklist for the parent and for the school counter. |

### Phase 3 — Coverage
*Effort: ~1–2 weeks.*

| # | Action |
|---|---|
| 3.1 | **Portuguese translation**, with a side-by-side EN/PT toggle on templates and document names, so users can show the PT version at the counter. |
| 3.2 | **Regionalise**: model schools and GAES offices as a table with district/city; let the user pick their region instead of assuming Lisbon. |
| 3.3 | Country-specific certificate notes for the largest origin groups (Brazil, India, Nepal, Bangladesh, Angola, Cape Verde, Ukraine) — apostille vs consular legalisation differs materially. |
| 3.4 | Consider a second track for **Concursos Especiais** (M23, holders of other courses), which many adult users actually need. |

### Phase 4 — Sustain
| # | Action |
|---|---|
| 4.1 | Admin editing for steps/checklists so content updates don't require a seeder + deploy. |
| 4.2 | Annual calendar-refresh checklist, tied to the `verified_at` field — flag steps unverified for >12 months. |
| 4.3 | Feature test for the roadmap page and the wizard branching (currently only auth/profile/progress are covered). |
| 4.4 | Distribution: outreach to immigrant NGOs, municipal integration desks, and school counsellors — the secondary audiences who will link back. |

---

## 7. Success metrics

Choose these now so Phase 1 analytics measures the right things.

- **Reach:** monthly unique visitors; % arriving from organic search.
- **Core value moment:** % of visitors who complete the eligibility wizard.
- **Depth:** % who reach Step 3 (exam substitution) — the step with the most hidden value.
- **Commitment:** account creation rate, and checklist items completed per account.
- **Outcome (the one that matters):** self-reported "I applied via the national contest" / "I was accepted." Worth a one-question post-August survey.
- **Trust:** % of steps with `verified_at` inside 12 months.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| **Wrong guidance costs a user a year and thousands of euros.** | Phase 0 citations + `verified_at` + disclaimer + always route uncertainty to BE-COM. |
| Rules change annually (deliberations, portarias, calendar). | Annual refresh checklist; calendar stored as data, not prose. |
| Solo-maintainer bus factor; contact email expires. | Project email in config, admin editing, content in DB not code. |
| Confusion with official DGES channels. | Explicit "independent, unaffiliated" disclaimer; always link the official page alongside. |
| Personal data (documents, residency status) if a locker is added. | Store status flags only — never uploaded documents — unless a proper data-protection review is done first. |

---

## 9. Recommended immediate sequence

1. Phase 0 in full — accuracy and citations. *Nothing should ship before this.*
2. Phase 1.1–1.4 — routes, meta, sitemap, deploy. This is what makes the project exist for its audience.
3. Phase 2.1 + 2.3 — full checklists and the deadline engine. These are the two features that make accounts worth creating.
4. Then measure for one intake cycle before building Phase 3.

---

## Sources

- [Decreto-Lei n.º 62/2018 — Estatuto do Estudante Internacional (DGES)](https://www.dges.gov.pt/en/node/1419)
- [Condições de acesso e ingresso no ensino superior — FAQ (DGES)](https://www.dges.gov.pt/pt/faq/condicoes-de-acesso-e-ingresso-no-ensino-superior)
- [Calendário do Concurso Nacional de Acesso (DGES)](https://www.dges.gov.pt/pt/pagina/calendario-concurso-nacional-de-acesso-0?plid=593)
- [Substituição de provas de ingresso por exames estrangeiros — Artigo 20.º-A (DGES)](https://www.dges.gov.pt/pt/pagina/substituicao-de-provas-de-ingresso-por-exames-estrangeiros-artigo-20o)
- [Guia da Candidatura — Acesso ao Ensino Superior 2026 (DGES)](http://www.dges.gov.pt/guias/pdfs/GuiaCandPub2026.pdf)
- [Estudantes com ensino secundário estrangeiro (DGES)](https://www.dges.gov.pt/en/node/172)
- [Pedir equivalência de habilitações estrangeiras do ensino básico e secundário (gov.pt)](https://www.gov.pt/servicos/pedir-equivalencia-de-habilitacoes-estrangeiras-do-ensino-basico-e-secundario)
- [Equivalências Estrangeiras (Direção-Geral da Educação)](https://www.dge.mec.pt/equivalencias-estrangeiras)
- [Portugal's immigrant population revised upward (AIMA data summary)](https://portugaldecoded.substack.com/p/portugals-immigrant-population-revised)
- [Data from AIMA and INE on immigration in Portugal are different — The Portugal News](https://www.theportugalnews.com/news/2026-05-13/data-from-aima-and-ine-on-immigration-in-portugal-are-different/1021388)
