# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Students, 5–10 years old (Khối 1–5, Vietnamese primary school).** They play in the school computer lab (shared PCs with mouse or trackpad) and sometimes on school tablets or phones. Khối 1 kids mostly cannot read yet; Khối 2 read slowly. They pick their own name from a card list, they do not type.
- **Teachers (Tin học).** They set up classes and student lists, watch class progress live during the lesson, and export results to Excel for periodic assessment. They get in with a PIN.

## Product Purpose

Turn the existing Tin học textbook lessons, slides and worksheets (Chân trời sáng tạo / Kết nối tri thức) into short game stages. A student reads a quick "knowledge treasure" summary, plays 5 challenges (multiple choice, drag-to-match/order, flip-card pairs), earns stars, XP and a downloadable certificate, and moves up the class leaderboard. Success: a whole class finishes a stage in one lab period, and the teacher leaves with a filled results sheet.

## Positioning

Built around one class in one room: no accounts, no typing, runs on the teacher's machine over the school LAN with no internet, and every result lands in the teacher's dashboard and Excel export.

## Operating Context

- Runs as a Node server on the teacher's PC; students open its LAN address. Data lives in one SQLite file.
- Used during a 35–40 minute lab lesson; the teacher may project the leaderboard.
- Rooms can be noisy; sound has a mute toggle.

## Capabilities and Constraints

- Student flow: choose grade → choose class → tap own name card → adventure map (locked / current / done with 1–3 stars) → knowledge treasure → 5 challenges → result + certificate PNG.
- Challenge types: quiz, drag (match or order into numbered slots), memory flip cards. Content lives in `public/lessons.js`.
- Teacher area (PIN): live dashboard, per-question correct rates, student list import (paste from Excel or .csv/.txt), class management, teacher name on certificates, CSV export.
- Only Khối 3 has lessons so far (3 sample lessons written for this MVP, not copied from the textbook). Other grades show "coming soon".
- No external services required; web fonts may be unavailable offline.

## Brand Commitments

- Free to rename the product and redraw the mascot (user decision, 2026-11-20).
- Visual reference the user made binding: Parroto's game pages (https://parroto.app/vi/vocab-battle). Keep: chunky game buttons with a thick bottom edge and press-down feel; a game hub of big illustrated cards with a strong "play" call to action; a mascot drawn into every game card. Not kept: Parroto's dark navy background.
- Language: Vietnamese, addressed to the child as "em".

## Evidence on Hand

- Original requirements PDF: `~/Downloads/Yeu_Cau_Thiet_Ke_Web_Hoc_Tap_Tieu_Hoc.pdf`.
- No real textbook content, photos, school logos, or testimonials yet. Sample lessons and sample class lists are synthetic.

## Product Principles

1. A five-year-old can finish a stage without reading and without help.
2. Every answer gets instant, kind feedback; a mistake points to the right answer instead of scolding.
3. One obvious action per screen, sized for small, imprecise hands.
4. The teacher sees every result without extra work.

## Accessibility & Inclusion

- Touch targets at least 2 cm × 2 cm for young children (NN/g children's UX research).
- Every drag interaction also works by tap-then-tap (dragging with a trackpad is hard under age 9).
- Instructions combine icon and text; never text alone.
- Respect `prefers-reduced-motion`; mute toggle always visible.
