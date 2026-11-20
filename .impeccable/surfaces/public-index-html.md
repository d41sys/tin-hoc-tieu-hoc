---
version: 1
slug: "public-index-html"
primary_target: "public/index.html"
related_targets: ["public/app.js","public/style.css"]
---

Scope: the whole student app (grade → class → name → game hub → lesson → challenges → result/certificate → leaderboard) plus the teacher page. Mode: operate.

Audience/job: children 5–10 in a school computer lab or on tablets finish one 5-challenge stage without reading or help; the teacher watches results.

## Direction contract

THESIS: Every stage is a picture the child colours in. Colouring is the app's only state language: uncoloured line art is locked, coloured art is open, scribbled stars are earned. Refuses the generic glossy kids-app grid where every card is equally loud.

OWN-WORLD: White drawing-paper ground (#FFFFFF; detector flagged the earlier #FFFDF7 cream), graphite ink text, six wax crayons (red, orange, yellow, green, blue, purple), each with a darker wax edge used as the chunky bottom edge of buttons and cards. Baloo 2 display, Nunito body, three sizes. Fluent Emoji Color illustrations; their High Contrast line versions mark locked. Lucide line icons.

STORY: The child sees which picture is waiting to be coloured, taps one big CHƠI NGAY button, hears each question read aloud, gets a crayon ring on the right answer, and watches the stage picture and its stars fill with colour.

FIRST VIEWPORT: Top bar (logo, child avatar + name, Xếp hạng, sound, Giáo viên). Greeting row with stars/XP chips. A grid of same-scale stage cards: art panel on the stage's crayon tint with the robot mascot peeking, stage badge on the art, title, stars, then a full-width chunky button. Current stage card carries the only saturated CTA.

FORM: Crayon box (seed:3986a8490841f7d7). Raises: one decision per screen with pictogram + word + voice; same-scale stages on one baseline; right/wrong coded by mark shape (ring vs cross), not colour alone; three type sizes; a stage is exactly five slots.

SIGNATURE: Hand-drawn crayon ring drawn around the correct answer (animated stroke), and locked→coloured art swap on the hub.

Constraints: works offline on LAN (self-hosted fonts and images), 2 cm touch targets, tap-then-tap alternative to every drag, reduced motion respected.
