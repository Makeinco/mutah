# Access Navigator

You are building the first high-quality interactive MVP for:

مُتاح ماب | MUTAH MAP

Do not treat this as a generic map application.

MUTAH MAP is an:

AI-Powered Accessibility Decision Platform

Its purpose is to help users understand visible entrance accessibility evidence before visiting a facility.

The core product promise is:

اعرف قبل أن تصل

The user journey is:

Discover → Understand → Decide → Contribute → Verify

Do not add any feature outside this journey.



1. PRODUCT SCOPE — LOCKED

The MVP focuses only on:

physical access needs related to the facility entrance.

The AI analyses ONLY five visible indicators:

Steps or raised threshold
درجات أو عتبة مرتفعة

Ramp
منحدر

Handrail
درابزين

Path obstruction
عائق في مسار الوصول

Accessible parking or accessibility sign
موقف مخصص أو علامة إتاحة

Do NOT add:

elevators

escalators

automatic doors

restrooms

indoor accessibility

door measurements

ramp slope

accessibility certification

general accessibility score

healthcare

marketplace

employment

charity integration

social network

AR

voice assistant

Do not expand the scope.



2. CORE AI PRINCIPLE

The product philosophy is:

AI Observes. Humans Verify.

Workflow:

Image
→ Quality Check
→ Privacy Check
→ AI Analysis
→ Visual Evidence
→ User Confirmation
→ Human Review
→ Publish

Never imply that AI certifies a building.

AI results are preliminary evidence.

Support the states:

Present

Absent

Unknown

Not Visible

Not Applicable

Critical rule:

Not Visible does not mean Absent.



3. DECISION LOGIC

Do NOT create a universal accessibility score.

Never display:

92/100
95% Accessible
Excellent Accessibility
Fully Accessible

Instead use decision summaries such as:

يطابق احتياجاتك المرصودة

يطابق جزئيًا

لا يطابق حاجة أساسية

المعلومات غير كافية

Always explain why.

Evidence is more important than a score.



4. BRAND

Brand:

مُتاح | MUTAH

Product:

مُتاح ماب | MUTAH MAP

Arabic is the primary language.

Build native RTL from the beginning.

Use:

lang="ar"
dir="rtl"

The approved MUTAH logo will be uploaded separately and must be treated as a locked brand asset.

Do not redraw or replace it.



5. BRAND COLORS

Core colors:

MUTAH BLUE
#0066FF

MUTAH GREEN
#00FF00

Blue represents:

community, trust, technology and participation.

Green represents:

access, opening, empowerment and possibility.

The green color is conceptually:

The Color of Access.

However:

Do not use #00FF00 automatically for text where contrast is insufficient.

Create accessible UI derivatives while preserving the original brand colors.



6. OPEN DOOR DESIGN DNA

A central philosophy of MUTAH is:

The Open Door

In the Arabic logo, the letter م visually carries the idea of an open green door.

In the English MUTAH logo, the letter A uses the same conceptual open-door form.

The open door represents:

barrier → opening → access → opportunity

Use this philosophy subtly.

It may influence:

whitespace

reveal transitions

card openings

image framing

map markers

directional geometry

progress transitions

Do NOT repeat door icons everywhere.

The open door is Design DNA, not decoration.

Design principle:

Open Space is Brand Space.



7. VISUAL DIRECTION

The product should feel:

Human

Intelligent

Saudi

Premium

Calm

Accessible

Trustworthy

Open

Modern

Avoid the appearance of a generic AI startup.

Do NOT use:

purple gradients

glowing AI spheres

excessive glassmorphism

cyberpunk styling

excessive shadows

excessive cards

decorative dashboards

fake testimonials

generic accessibility branding

Use generous whitespace and a strong typographic hierarchy.



8. PRIMARY NAVIGATION

Do not expose every screen as navigation.

For the normal mobile user use only:

استكشف

Discover

ساهم

Contribute

مُتاح

About / product identity

Search should be prominent inside Discover.

Other screens occur within journeys.

Review Center and MUTAH Insights are role-specific experiences.



9. SCREEN 01 — HOME

Create a short, premium start screen.

Do NOT make a long marketing landing page.

Hierarchy:

Approved MUTAH logo

Headline:

اعرف قبل أن تصل

Supporting line:

معلومات واضحة عن المدخل تساعدك قبل زيارة المكان.

Search:

ابحث عن مكان...

Primary CTA:

استكشف الأماكن

Secondary:

حدد احتياجات الوصول

Optional small preview:

أماكن تم تحديث معلوماتها مؤخرًا

Keep this screen very clean.

Use the open-door philosophy subtly in the composition.



10. ACCESS PREFERENCES

Ask:

ما الذي تحتاجه لتكون الزيارة أسهل؟

Options:

مسار بلا درجات

منحدر عند وجود ارتفاع

مسار خالٍ من العوائق

درابزين

موقف مخصص

Allow:

تخطي الآن

Do not request medical diagnosis.

Use:

احتياجات الوصول

not disability classification.



11. SCREEN 02 — DISCOVER

This is the main operational experience.

Include:

Search

Access-needs filters

Map/List switch

Use:

الخريطة | القائمة

Map must not be the only discovery mechanism.

Facility cards should show:

facility name

category

approximate distance where available

latest verification date

relevant entrance evidence

information completeness

Do not show universal accessibility scores.

Example:

مقهى مثال
تم التحقق قبل 3 أيام

منحدر: ظاهر
مسار الوصول: لا يظهر به عائق
الموقف المخصص: غير مرئي في الصور الحالية

CTA:

عرض التفاصيل



12. SCREEN 03 — FACILITY PROFILE

This is the most important screen in the product.

Use an:

Evidence First

design.

Top area:

facility name

category

location

large entrance image

Then a decision summary:

يطابق احتياجاتك المرصودة

or:

المعلومات غير كافية

Immediately explain the reasoning.

Section:

معلومات المدخل

Show the five indicators using:

icon + text + state + evidence

Example:

منحدر

ظاهر

يظهر منحدر بجانب المدخل.

درجات أو عتبة

ظاهرة

تظهر درجة أمام الباب الرئيسي.

موقف مخصص

غير مرئي

الموقف خارج إطار الصور الحالية، لذلك لا يمكن تأكيده.

Unknown information must remain visible.

Then:

دليل التحليل

Clearly identify it as:

تحليل أولي يحتاج إلى تحقق

Then:

حالة المعلومة

Examples:

راجعها فريق مُتاح
آخر تحقق: 24 أغسطس 2026
المصدر: صورة مساهم

Primary CTA:

ساهم بصورة أحدث

Secondary:

أبلغ عن تغير



13. SCREEN 04 — CONTRIBUTE

Heading:

ساهم

Supporting copy:

ساعد في جعل معلومات الوصول أكثر وضوحًا وحداثة.

Primary card:

حدّث صورة مدخل

أضف صورة حديثة تساعد الآخرين على معرفة ما ينتظرهم قبل الوصول.

Other options:

أضف مرفقًا

أبلغ عن تغير

Keep contribution functional.

No social feed.

No points.

No leaderboard.

No unnecessary gamification.



14. IMAGE UPLOAD

Create a very simple upload experience.

Before upload:

صوّر المدخل بوضوح

Guidance:

حاول إظهار الطريق إلى الباب.

تجنب تصوير الوجوه.

تجنب ظهور لوحات المركبات.

استخدم صورة حديثة قدر الإمكان.

Actions:

التقاط صورة

اختيار من الجهاز

After selection:

show image preview.

Allow:

إعادة الاختيار

and:

متابعة للتحليل



15. SCREEN 05 — AI ANALYSIS

Make this a strong product moment without futuristic theatrics.

Show progress states such as:

جاري تجهيز الصورة

✓ فحص جودة الصورة

✓ حماية الخصوصية

◌ تحليل عناصر المدخل

◌ تجهيز الأدلة

Use subtle motion inspired by the open-door philosophy.

Support reduced motion.

Use calm visual feedback.

Do not use:

Scanning lasers
AI brain icons
Robot illustrations
Neon effects



16. AI RESULTS

Show:

تحليل أولي للمدخل

Supporting copy:

راجع ما ظهر في الصورة قبل إرسال المساهمة.

Display exactly five observations.

Examples:

منحدر

ظاهر

يظهر منحدر بجانب المدخل.

درابزين

ظاهر

يظهر درابزين بمحاذاة المنحدر.

درجات أو عتبة

غير ظاهرة

عائق في المسار

غير ظاهر

موقف مخصص أو علامة إتاحة

لا يمكن التأكد

الموقف خارج إطار الصورة الحالية.

Use different visual treatment for:

Confirmed visual evidence

Unknown

Not Visible

But never use color alone.



17. SCREEN 06 — CONFIRM & CORRECT

For each indicator allow:

أؤكد

تصحيح

لا أستطيع التأكد

Corrections should use simple controls.

Do not expose raw AI output.

Do not expose JSON.

Do not expose confidence percentages.

Bottom CTA:

إرسال للمراجعة

Supporting line:

ستتم مراجعة المساهمة قبل نشرها.

After submission:

show:

شكرًا لمساهمتك

أُرسلت المعلومات إلى المراجعة.

CTA:

العودة إلى المرفق



18. SCREEN 07 — REVIEW CENTER

Build a separate responsive reviewer interface.

Desktop-first.

Layout:

Moderation Queue

Left/side:

list of pending contributions.

Main content:

entrance image

facility

AI observations

contributor confirmations

current published evidence

verification history

Actions:

اعتماد

طلب توضيح

رفض

Require reviewer reasoning where appropriate.

Show status:

Pending Review

Reviewed

Rejected

No automatic publishing.



19. SCREEN 08 — MUTAH INSIGHTS

This is not a generic admin dashboard.

It is a:

Data + Impact View

Use pilot data only.

Metrics may include:

عدد المرافق المغطاة

عدد صور المداخل

عدد المساهمات المراجعة

نسبة اكتمال البيانات

المعلومات التي تحتاج تحديثًا

أكثر الحواجز المرصودة

Use cards sparingly.

Use simple charts only where helpful.

Also provide accessible table alternatives.

If demo data is used, visibly label:

بيانات تجريبية

Do not invent national numbers.

Do not create city ranking.

Do not create financial recommendations.



20. DESIGN SYSTEM

Build reusable components for:

Buttons

Icon buttons

Search

Inputs

Facility Cards

Access Preferences

Evidence Items

Indicator States

Verification Badges

Upload

AI Evidence

Confirmation Controls

Map Markers

Map/List Toggle

Bottom Navigation

Sheets

Dialogs

Empty States

Error States

Loading States

Metric Cards

Simple Charts

Create consistent:

spacing

radii

type scale

icon size

layout grid



21. ACCESSIBILITY

Target selected WCAG 2.2 AA requirements.

Do not claim full compliance.

Implement:

native RTL

semantic HTML

keyboard support

strong visible focus

accessible labels

strong contrast

information not dependent on color

appropriate touch targets

body text approximately 16px or greater

alt text structures

reduced motion

accessible validation messages

support for 200% zoom

Map experience must always have an accessible list alternative.



22. MOBILE-FIRST

Mobile is the primary experience.

Phone:

single-column

bottom navigation

large controls

Map/List switch

Tablet:

more horizontal space

Desktop:

Discover can become split:

facility list + map

Review Center can use a wider moderation layout.

Insights can use a responsive grid.

Do not simply stretch mobile cards on desktop.



23. REQUIRED PRODUCT STATES

Design:

Loading

Empty

Error

Unknown

Not Visible

Pending Review

Team Reviewed

Disputed

Stale

Insufficient Image Quality

Offline/failure where appropriate

Unknown states are a feature, not a defect.



24. FLAGSHIP DEMO JOURNEY

Make this the strongest journey in the prototype:

User opens MUTAH

→ chooses access preferences

→ searches for facility

→ opens Facility Profile

→ sees incomplete evidence

→ contributes an entrance image

→ AI analyzes image

→ at least one indicator is Unknown / Not Visible

→ user confirms/corrects

→ submits for review

→ reviewer approves

→ facility evidence updates

→ MUTAH Insights updates

This journey is more important than all secondary features.



25. IMPLEMENTATION

Create the frontend in a clean reusable React + TypeScript architecture.

Prefer Tailwind CSS.

Keep code suitable for later integration with:

Next.js App Router

Supabase

MapLibre / MapTiler

Gemini through an AI provider adapter

Do not tightly couple the design to mock data.

Separate UI from data and business logic.

Use mock data only where necessary for demonstrating the interaction.

Clearly structure it so mock data can later be replaced by Supabase.



FINAL RULES

DO NOT expand the MVP.

DO NOT redesign MUTAH.

DO NOT create an accessibility score.

DO NOT present AI as certification.

DO NOT hide uncertainty.

DO NOT make the map the product.

The product is the decision.

The user must understand:

ماذا أعرف؟

ما الذي لا أعرفه؟

ولماذا؟

Core product principle:

Evidence → Understanding → Decision

Core AI principle:

AI Observes. Humans Verify.

Core brand principle:

The open door is not decoration.

It represents the moment when access becomes possible.

Now create the full cohesive Arabic-first RTL MUTAH MAP interactive MVP.



For this first build, prioritize the complete interactive frontend, design system, navigation, responsive layouts, and realistic mocked interaction states. Do not implement Supabase, Gemini, production authentication, or external APIs yet. Structure the code so these can be connected later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/60d63a6b-db73-4901-ab33-74d467e47e86).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
