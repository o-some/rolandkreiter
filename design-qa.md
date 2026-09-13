# Design QA — Mobile gallery revision

Date: 13 September 2026

## Source evidence

- User-supplied iPhone screenshot of the Awards section.
- Observed P1: “Ausgezeichnete” exceeded the mobile viewport and created a false right-side canvas.
- Observed P2: excessive empty vertical space before the Awards heading.
- Observed P2: vertically stacked awards felt static and repetitive.
- Observed P2: wide project photography was cropped too aggressively inside portrait cards.
- Observed content issue: the GIANT outer mill chambers were incorrectly detached.

## Implemented corrections

- Mobile heading scale is word-safe; the Awards title uses two controlled non-breaking lines.
- Page and section widths are constrained to the viewport.
- Mobile awards use a horizontal scroll-snap gallery with position counter.
- Wide project images use a dedicated 4:3 contained presentation.
- Mobile hero now includes the new mysqueeze ambience scene.
- Material study uses a newly generated stainless-steel macro.
- GIANT uses a newly generated image: all four stainless chambers remain connected and only the black center mechanism is opened.
- Subtle view-linked image drift adds motion on supported mobile browsers and respects reduced-motion preferences.
- Published HTML and CSS reference only newly generated editorial and avatar images.
- Desktop browser verification passed with no application console errors or horizontal overflow.

## Remaining verification

The cloud browser exposes only a desktop viewport in this session. It rejected creation of a separate mobile-width comparison surface, so a same-viewport post-fix iPhone capture is not available here. Final mobile visual comparison requires a refreshed screenshot from the user’s device.

final result: blocked
