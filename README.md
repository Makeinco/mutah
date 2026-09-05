# MUTAH MAP | مُتاح ماب

MUTAH MAP is an evidence-first accessibility decision prototype built for a hackathon MVP.

**Product promise:** اعرف قبل أن تصل | Know Before You Go

## Product principles

- Evidence → understanding → decision.
- AI Observes. Humans Verify.
- Not Visible ≠ Absent.
- No universal accessibility score.
- No certification or compliance claim.
- Missing and conflicting evidence remain visible.

## Current scope

The product uses multi-view facility evidence rather than a single entrance photo.

Facility zones:
- Approach path / مسار الوصول
- Entrance / المدخل
- Parking / المواقف
- Elevator / المصعد
- Accessible restroom / دورة المياه المخصصة

User-facing access needs:
- Step-free route / مسار بلا درجات
- Ramp / منحدر
- Obstacle-free path / مسار خالٍ من العوائق
- Handrail / درابزين
- Accessible parking / موقف مخصص
- Elevator / مصعد
- Accessible restroom / دورة مياه مخصصة

Personalized status uses four states only:
- متاح
- متاح جزئيًا
- غير متاح وفق احتياجاتك الحالية
- معلومات غير كافية

## Architecture

Current frontend: React + TypeScript + TanStack Start, inherited from the Lovable prototype and retained to reduce hackathon delivery risk.

Backend project provisioned on Supabase in `eu-central-1` with core migration applied. The schema includes facilities, facility zones, evidence images, AI analyses, observations, contributor confirmations, moderation queue, facility summaries, reports, audit events, and pilot metrics. Row-level security is enabled; public reads are limited to reviewed facility data and sanitized reviewed images.

Production data flow:

`Facility → Facility Zone → Evidence Image(s) → AI Observation(s) → User Confirmation → Human Moderation → Verified Facility Summary`

The current UI still uses the local prototype repository as a resilient demo fallback while production adapters are being connected. Do not remove that fallback until the live Supabase/Gemini path is fully tested.

## Environment

Copy `.env.example` and provide values through your deployment environment. Never commit private server secrets.

Expected services:
- Supabase
- Gemini Vision
- MapTiler / map provider
- Vercel

## Development

```bash
bun install
bun run dev
```

Quality gate:

```bash
bun run lint
bun run build
```

GitHub Actions runs lint and production build on the refinement branch / pull request.

## Demo journey

Home → choose access needs → Explore → Facility Profile → personalized status → why this result → inspect missing evidence → Contribute → choose zone → upload one or multiple images → AI preliminary observation → contributor confirms/corrects → human review → facility evidence updates.

## Data honesty

Demo/sample information must be labeled as such. Do not present prototype facilities, sample metrics, model output, partnerships, integrations, national coverage, legal compliance, or accessibility certification as verified reality.
