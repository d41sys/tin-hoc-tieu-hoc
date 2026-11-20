---
name: Tin học vui
description: A crayon box on drawing paper. Colour is the only state language: line art is locked, colour is open, filled stars are earned.
colors:
  paper: "#FFFFFF"
  paper-tint: "#F2F4F9"
  line: "#E1E5EF"
  line-strong: "#C3C9D9"
  graphite: "#2B2D42"
  graphite-soft: "#565970"
  crayon-red: "#E0433A"
  crayon-red-wax: "#A82D26"
  crayon-red-wash: "#FDE4E2"
  crayon-orange: "#FF9F1C"
  crayon-orange-wax: "#C47506"
  crayon-orange-wash: "#FFEBD0"
  crayon-yellow: "#FFD23F"
  crayon-yellow-wax: "#C9A114"
  crayon-yellow-wash: "#FFF5CC"
  crayon-green: "#23955A"
  crayon-green-wax: "#17683E"
  crayon-green-wash: "#DCF2E4"
  crayon-blue: "#2A7FD4"
  crayon-blue-wax: "#1B5C9E"
  crayon-blue-wash: "#DDEBFA"
  crayon-purple: "#8653C0"
  crayon-purple-wax: "#623A92"
  crayon-purple-wash: "#EEE4F8"
typography:
  numeral:
    fontFamily: "'Baloo 2', Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 1
  display:
    fontFamily: "'Baloo 2', Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Baloo 2', Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1.15
  button:
    fontFamily: "'Baloo 2', Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.45
rounded:
  sm: "10px"
  md: "14px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.crayon-green}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: "0 28px"
    height: "72px"
  button-primary-orange:
    backgroundColor: "{colors.crayon-orange}"
    textColor: "{colors.graphite}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: "0 28px"
    height: "72px"
  button-small:
    backgroundColor: "{colors.crayon-green}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0 18px"
    height: "52px"
  grade-tile:
    backgroundColor: "{colors.crayon-blue}"
    textColor: "{colors.paper}"
    typography: "{typography.numeral}"
    rounded: "{rounded.lg}"
    padding: "24px 12px 20px"
  stage-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  stage-card-locked:
    backgroundColor: "{colors.paper-tint}"
    textColor: "{colors.graphite-soft}"
  option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: "12px 22px"
    height: "80px"
  option-right:
    backgroundColor: "{colors.crayon-green-wash}"
    textColor: "{colors.graphite}"
  option-wrong:
    backgroundColor: "{colors.crayon-red-wash}"
    textColor: "{colors.graphite}"
  piece:
    backgroundColor: "{colors.crayon-yellow}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
    height: "76px"
  piece-placed:
    backgroundColor: "{colors.crayon-green}"
    textColor: "{colors.paper}"
  nav-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "52px"
  chip:
    backgroundColor: "{colors.paper-tint}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "52px"
---

# Design System: Tin học vui

## Overview

**Creative North Star: "The Crayon Box"**

Every stage is a picture the child colours in. Colour is the app's only state language: uncoloured line art is locked, colour is open, filled stars are earned. The ground is plain white drawing paper with graphite ink; six wax crayons (red, orange, yellow, green, blue, purple) supply every saturated surface, and each crayon carries a darker wax edge that becomes the thick bottom edge of its buttons and cards. Illustrations are Fluent Emoji Color; their high-contrast line versions stand in for locked art. Icons are Lucide line icons.

The density is deliberately low and the scale deliberately large: one decision per screen, pictogram plus word, targets of at least 2 cm. Only three text sizes exist. On a screen of same-scale cards, exactly one is loud: the current stage carries the only saturated call to action, the rest stay paper-white or washed. This refuses the glossy kids-app grid where every card shouts equally.

The chunky bottom edge on buttons and cards is a user-pinned choice taken from the Parroto reference (a binding brand commitment in PRODUCT.md), together with the press-down feel and the mascot drawn into game cards. Parroto's dark navy ground is not kept.

**Key Characteristics:**
- White paper ground, graphite ink, six crayons each in three tones: solid, wax edge, pale wash.
- Colour means state: line art locked, colour open, filled star earned.
- Thick hard bottom edge on pressable crayon surfaces; it travels down when pressed.
- Three type sizes; pre-reader friendly (pictogram and word together).
- Right and wrong are coded by mark shape (check vs cross in the key), never by colour alone.
- Motion is short and physical, and fully disabled under reduced motion.

## Colors

Drawing paper and graphite, with six saturated crayons that each come as solid, wax edge and wash.

### Primary
- **Meadow Green Crayon** (#23955A): the default crayon (`--c`), so the base colour of the primary CTA, correct answers, selected chips, placed pieces and progress bars. Its wax edge, **Pressed Green Wax** (#17683E), is also the colour of `ok` marks on the teacher dashboard. Wash **Green Mist** (#DCF2E4).

### Secondary
Every stage and grade is assigned one crayon through `data-crayon`; the assigned crayon recolours its buttons, edges, art panel wash and result badge.
- **Poppy Red Crayon** (#E0433A) / wax **Brick Red Wax** (#A82D26) / wash **Blush Wash** (#FDE4E2): wrong answers (with a cross mark), errors, delete-hover. White text on solid.
- **Tangerine Crayon** (#FF9F1C) / wax **Burnt Orange Wax** (#C47506) / wash **Apricot Wash** (#FFEBD0): graphite text on solid, never white.
- **Sunflower Crayon** (#FFD23F) / wax **Mustard Wax** (#C9A114) / wash **Butter Wash** (#FFF5CC): draggable pieces, earned stars (fill with Mustard Wax stroke), drop-target hover, "me" row highlight, text selection. Graphite text on solid.
- **Sky Blue Crayon** (#2A7FD4) / wax **Denim Wax** (#1B5C9E) / wash **Sky Wash** (#DDEBFA): memory card backs, and the focus ring and picking-mode outlines (always the solid blue).
- **Grape Crayon** (#8653C0) / wax **Plum Wax** (#623A92) / wash **Lilac Wash** (#EEE4F8): grade and stage crayon, white text on solid.

### Neutral
- **Drawing Paper** (#FFFFFF): page, card, button-ghost and field ground. Pure white, not cream.
- **Pencil Tint** (#F2F4F9): locked art panels, chips, hovered paper, bars, slot "wrong" fill.
- **Pencil Line** (#E1E5EF): quiet borders, dividers, the edge under unselected cards.
- **Pencil Line Strong** (#C3C9D9): interactive outlines (ghost button, options, fields, dashed drop zones) and their edges.
- **Graphite Ink** (#2B2D42): all primary text and icon strokes; also the tint of the mascot bubble's soft shadow.
- **Graphite Soft** (#565970): secondary text, muted notes, locked captions.

### Named Rules
**The Colour Is State Rule.** Uncoloured line art is locked, a crayon-tinted panel is open, a filled star is earned. Never use crayon colour as pure decoration, and never colour a locked thing.
**The One Loud Card Rule.** On any grid of same-scale cards only the current/next one carries a saturated CTA; the others stay paper or wash.
**The Wax Edge Rule.** A crayon surface always pairs with its own darker wax edge, never a neutral grey or black one. Edge colour is the crayon's `-d` tone.
**The Shape Not Colour Rule.** Correct shows a check in the option's key; wrong shows a cross. Colour reinforces, it never carries the meaning alone.

## Typography

**Display Font:** Baloo 2 (with Nunito, ui-rounded, system-ui, sans-serif)
**Body Font:** Nunito (with ui-rounded, system-ui, sans-serif)
Both are self-hosted (Vietnamese, latin and latin-ext subsets) so the app works offline on the LAN.

**Character:** Baloo 2 at weight 800 is round, heavy and friendly, used for anything the child taps or must notice; Nunito at weight 700 carries all supporting reading text. The pairing reads like thick crayon lettering over a clear sentence.

### Hierarchy
- **Numeral** (800, 6rem, 1; 4.5rem under 720px): grade numbers on the grade picker; also 3.5rem on memory card backs. Monumental on purpose.
- **Display** (800, clamp(2rem, 4vw, 2.5rem), 1.15, -0.02em, balanced wrap): page titles (h1) and podium numbers.
- **Headline** (800, 1.625rem, 1.15): section and question titles (h2), logo, and answer text (in Nunito 800 at 1.2 line-height).
- **Button** (800 Baloo 2, 1.625rem, 1, +0.01em, uppercase): all `.btn` labels. Small buttons drop to 1.125rem.
- **Body** (700, 1.125rem, 1.45): all running text, chips, piece labels, tags, dashboard cells (1rem).

### Named Rules
**The Three Sizes Rule.** Only 1.125rem, 1.625rem and the clamped 2rem–2.5rem exist for text. New text picks one of them; it does not invent a fourth. Numerals are the one monumental exception.
**The Heavy By Default Rule.** Nothing is lighter than weight 600; labels and buttons are 800. The only script face (Dancing Script 700) appears solely on the certificate image drawn to canvas, for the teacher's signature.

## Layout

A single centred column, `main` max-width 1120px with 20px side padding (14px under 720px) and 32px top. A sticky top bar (logo, child avatar and name, Xếp hạng, sound, Giáo viên) holds navigation. Pages are grids of same-scale cells on one baseline: `repeat(auto-fit/auto-fill, minmax(...))` for grades (170px), names (160px), stages (290px, `align-items: stretch`), flip cards (150px), zones (200px). Gaps run on an 8-12-16-24-32px rhythm: 16px inside grids of choices, 24px between stage cards, 32px above action rows. A stage is exactly five slots in a row. The mascot Bíp is sticky at the bottom right so on short pages it sits below content, never over tap targets.

Responsive: a single breakpoint at 720px collapses the logo to its icon, nav buttons to icons (labels remain for assistive tech), hides the child's name, shrinks numerals and the mascot, and makes titles full-width. Minimum touch height: 48px for nav on mobile, 52px small controls, 72–80px primary controls. Every drag has a tap-then-tap alternative.

## Elevation & Depth

Depth is structural, not ambient. Pressable surfaces (crayon buttons, grade tiles, name cards, stage cards, answer options, draggable pieces, flip-card backs) sit on a hard, zero-blur bottom edge, like the side of a crayon block; pressing slides the surface down by the edge height and the shadow collapses to zero. Flat panels (teacher panels, soon notes, certificates) have no shadow, only a 3px border. The single soft shadow in the system belongs to the mascot's speech bubble.

This hard offset edge is a user-pinned choice from the Parroto reference (PRODUCT.md Brand Commitments). It is scoped to pressable surfaces and does not extend to static containers.

### Shadow Vocabulary
- **Crayon edge** (`box-shadow: 0 6px 0 var(--cd)`): the default edge on crayon buttons, grade tiles and the current stage card, in the crayon's wax tone.
- **Small crayon edge** (`box-shadow: 0 4px 0 var(--cd)`): `.btn.small` (`--edge: 4px`) and placed pieces.
- **Paper edge** (`box-shadow: 0 6px 0 var(--line)`): unselected name cards and non-current stage cards.
- **Outline edge** (`box-shadow: 0 6px 0 var(--line-d)`): ghost buttons and answer options at rest; right and wrong swap it to green or red wax.
- **Pressed** (`transform: translateY(6px); box-shadow: 0 0 0 <edge colour>`): `:active` on every pressable surface.
- **Podium block** (`inset 0 -6px 0 var(--cd)`): leaderboard blocks carry the edge inside so the stack stays flush.
- **Mascot bubble** (`0 6px 16px rgba(43, 45, 66, .12)`): the only soft, blurred shadow.
- **Focus** (`outline: 4px solid var(--blue); outline-offset: 3px`): never replaced by a shadow.

### Named Rules
**The Press-Down Rule.** Whatever has a hard edge moves down by exactly that edge on `:active` and loses the edge. Static things never get a hard edge.
**The Edge Is The Crayon's Wax Rule.** Edge colour is always the surface's own `-d` crayon tone; neutral surfaces use Pencil Line or Pencil Line Strong.

## Shapes

Soft but sturdy. The standard radius is 16px (`--r`) on buttons, cards, options, pieces, panels, certificates. Smaller controls step down: 14px for nav and icon buttons, 12px for fields, key badges and textareas, 10px for progress slots. Chips and tags are full pills; avatars and the result art are circles; the bubble is 18px with a 4px tail corner. Borders are 3px (2px for chips, table cells and list dividers); dashed 3px borders mark an empty or droppable place (drop zones, locked-note, coming-soon).

## Components

### Buttons
Chunky crayon blocks that press down.
- **Shape:** 16px radius, 72px tall minimum, 0 28px padding; small variant 52px tall, 0 18px padding.
- **Primary:** crayon solid fill (green by default, otherwise the surrounding `data-crayon`), uppercase Baloo 2 800 at 1.625rem, text white on red/green/blue/purple and graphite on orange/yellow, 6px wax edge (`--edge`).
- **Hover / Focus:** hover brightens 6% (`filter: brightness(1.06)`); focus is the 4px blue ring, 3px offset. Active presses down 6px (4px small).
- **Ghost:** paper fill, graphite text, 3px Pencil Line Strong border, Pencil Line Strong edge.
- **Disabled:** grayscale, 60% opacity, no motion.

### Chips
Pill (999px), Pencil Tint fill, 2px Pencil Line border, 6px 14px padding, weight 800; a 24px illustration may lead. Teacher tags add a 36px circular close button that washes red on hover.

### Cards / Containers
- **Stage card:** paper, 3px Pencil Line border, 16px radius, 6px paper edge, clipped. Top 200px art panel on the stage's crayon wash with a 128px illustration, a 64px mascot peeking from bottom right and a pill badge top left; below, title, stars, description, then a full-width button. Locked: art panel Pencil Tint, illustration and mascot desaturated to 45% opacity, dashed locked note instead of a button. Current: border and edge take the crayon colour.
- **Name card:** 160px-min tile, 76px avatar, paper edge, border darkens on hover.
- **Treasure (lesson intro):** crayon-bordered panel with a wash header and 56px pictogram per fact, separated by 2px lines.
- **Panel (teacher):** 3px Pencil Line border, 22px padding, no shadow.

### Inputs / Fields
- **Style:** paper ground, 3px Pencil Line Strong border, 12px radius, 52px tall, weight 700; login PIN is centred with 0.3em letter spacing.
- **Chips (one-of-many):** the app has no native dropdowns. Chunky 64px buttons at 1.625rem Baloo, paper with Pencil Line Strong edge; selected (`aria-pressed=true`) fills with the current crayon and its wax edge. Inside teacher panels they shrink to 52px at 1.125rem with a 4px edge.
- **Focus:** the global 4px blue ring.

### Navigation
Sticky white top bar with a 3px Pencil Line underline. Nav buttons are 52px tall, 14px radius, 3px Pencil Line border, weight 800; hover tints to Pencil Tint with a stronger border; the current page takes a Graphite Ink border. Under 720px they become icon-only at 48px.

### Answer options and game pieces
- **Option:** 80px min, paper, 3px Pencil Line Strong border and edge, a 44px letter key badge. Right: green border, wash and wax edge, green key with a check. Wrong: red border, wash and wax edge, red key with a cross, 0.4s horizontal shake. The rest dim to 50%.
- **Piece:** Sunflower crayon block with 44px pictogram, grab cursor, edge in Mustard Wax. Selected: 4px blue outline and lifted 4px; dragged: ghost tilted -3deg at 1.05 scale; placed: green with a 4px green wax edge.
- **Progress slots:** five 28px pills; ok takes the crayon, no takes Pencil Tint with a Graphite Soft border, now takes a Graphite Ink border.
- **Flip card:** blue back with a large numeral and wax edge, paper front with line art; matched takes green border and wash. 0.45s Y-axis flip.

### Stars
A 30px outlined star (64px on results, 18px in the dashboard). Earned: Sunflower fill with a Mustard Wax stroke; empty: no fill, Pencil Line Strong stroke. On results, earned stars colour in from paper at 0.6 scale, staggered 0.25s.

### Mascot
Bíp the robot, 76px (52px mobile), in a sticky bottom-right row with a speech bubble. Reacts: jump twice when happy, shake when sad.

### Motion
Easing is one curve, `cubic-bezier(.16, 1, .3, 1)`. Press travel 0.12s; colour and background changes 0.2s; flip 0.45s; star colour-in 0.5s; shake 0.4s (±8px). Under `prefers-reduced-motion: reduce` all animation and transition durations collapse to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** pair every crayon surface with its own wax edge (`--cd`) and let it press down by the full edge on `:active`.
- **Do** use only the three text sizes (1.125rem, 1.625rem, clamped 2rem–2.5rem); numerals are the one monumental exception.
- **Do** keep one saturated call to action per card grid; the current stage is the loud one.
- **Do** mark right with a check and wrong with a cross, plus colour, never colour alone.
- **Do** put a pictogram next to every label; the youngest users read slowly.
- **Do** keep targets at least 52px (72px for primary actions) and give every drag a tap-then-tap alternative.
- **Do** keep illustrations as Fluent Emoji Color and locked art as their High Contrast line versions; icons are Lucide line.

### Don't:
- **Don't** use crayon colour as decoration, or colour anything the child has not unlocked.
- **Don't** use the hard bottom edge on static containers (panels, certificates, tables); it belongs to pressable surfaces only.
- **Don't** add a cream or tinted paper background; paper is pure white.
- **Don't** use dark navy backgrounds (the Parroto ground was explicitly not kept).
- **Don't** mix a neutral grey edge under a crayon surface, or white text on orange or yellow.
- **Don't** rely on external fonts, CDNs or images; everything is self-hosted for offline LAN use.
- **Don't** add a text size outside the ramp, or a weight below 600.
