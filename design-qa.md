# Design QA — Mobile luxury and interaction revision

Date: 13 September 2026

## Source evidence

- User-supplied iPhone screenshot of the Awards section.
- Observed P1: “Ausgezeichnete” exceeded the mobile viewport and created a false right-side canvas.
- Observed P2: excessive empty vertical space before the Awards heading.
- Observed P2: vertically stacked awards felt static and repetitive.
- Observed P2: wide project photography was cropped too aggressively inside portrait cards.
- Observed content issue: the GIANT outer mill chambers were incorrectly detached.
- Observed P1: the two-line Roland Kreiter hero lock-up collided on iPhone.
- Observed P1: white portrait captions lost contrast over bright architecture.
- Observed P1: the generated GIANT WebP failed to decode in the user’s iPhone browser.
- Observed P2: touch interaction on horizontal cards could feel like vertical dragging.

## Implemented corrections

- Mobile heading scale is word-safe; the Awards title uses two controlled non-breaking lines.
- Page and section widths are constrained to the viewport.
- Mobile awards use a horizontal scroll-snap gallery with position counter.
- Wide project images use a dedicated 4:3 contained presentation.
- Mobile hero now includes the new mysqueeze ambience scene.
- Material study uses a newly generated stainless-steel macro.
- GIANT uses a newly generated image with all four chambers fully connected and the entire mill closed; a JPEG delivery asset replaces the failed WebP on iPhone.
- Subtle view-linked image drift adds motion on supported mobile browsers and respects reduced-motion preferences.
- Published HTML and CSS reference only newly generated editorial and avatar images.
- Desktop browser verification passed with no application console errors or horizontal overflow.
- The mobile hero lock-up uses independent grid rows and an explicit gap.
- Portrait captions use dark translucent glass pills with persistent contrast.
- Mobile reveal states remain fully opaque while scrolling.
- Touch surfaces use native horizontal scrolling; custom pointer dragging is restricted to a mouse.
- Anchor targets account for the fixed mobile header.
- A new Design Code scene adds a restrained material image and three liquid-glass principle cards.

## Remaining verification

The cloud browser exposes only a desktop viewport in this session. It rejected creation of a separate mobile-width comparison surface, so a same-viewport post-fix iPhone capture is not available here. Final mobile visual comparison requires a refreshed screenshot from the user’s device.

final result: blocked
