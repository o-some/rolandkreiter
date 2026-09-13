# Design QA — Mobile sales-funnel revision

Date: 13 September 2026

## Source visual truth

- `/workspace/scratch/8f206493c8a0/upload/BF595EE1-B499-4FBD-B61A-3B8C683C641F.jpeg` — mobile project carousel, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/F173346C-19EF-4038-9B08-546912B5A66C.jpeg` — mobile intro typography, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/AE3A8CEF-01AD-4432-8798-60C669D79504.jpeg` — mobile glass treatment, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/B3B027D5-8034-4644-812D-C0E2FD2D8DAF.jpeg` — mobile product crop and split-card alignment, 707 × 1536 px.

The supplied captures include iPhone Safari chrome and appear to be approximately 2× density. The exact CSS viewport could not be reproduced by the available cloud browser.

## Implementation evidence

- Live implementation: `https://o-some.github.io/rolandkreiter/?release=616fad8`
- Browser-rendered desktop viewport: 1363 × 936 CSS px, device density controlled by the cloud browser.
- Desktop full-view checks were performed for Selected Works and the new Freelance section.
- The cloud browser did not expose a supported mobile viewport control, so no valid same-viewport mobile screenshot could be saved.

## Findings and fixes

- [P1] Project navigation landed between slides because JavaScript assumed a fixed 24 px gap while mobile CSS used a smaller responsive gap.
  - Fix: the active slide is now calculated from real element offsets, and buttons scroll directly to the selected card.
- [P1] Project photography used different mobile aspect ratios for portrait and landscape assets.
  - Fix: every mobile image stage now uses the same 4:3 frame and every project card uses the same width and content height.
- [P1] Large mobile headings used an overly tight line height.
  - Fix: mobile display typography was reduced slightly and raised to a 0.96 line height with controlled wrapping.
- [P1] Three simultaneous large backdrop filters produced a heavy grey glass effect and could contribute to Safari scroll jank.
  - Fix: mobile Design Code now uses one dark, highly transparent glass surface with a single blur pass; the three principles are clean rows within it.
- [P1] Scroll work ran layout reads and writes on every native scroll event, and view-timeline animations transformed several large images continuously.
  - Fix: scroll updates are frame-scheduled, section positions are cached, mobile parallax/view-timeline animation is removed, and lightweight one-time reveal motion remains.
- [P1] The portfolio lacked a direct commercial conversion path.
  - Fix: a Freelance Industrial Design section now presents the offer, three services, proof context, and two clear next actions leading to process and contact.
- [P1] The latest iPhone capture still showed a partial previous card and aggressive product cropping.
  - Fix: the mobile track now exposes exactly one 100%-wide card; all project imagery uses `object-fit: contain` inside an identical 4:3 stage so the full product remains visible.
- [P2] The narrative needed a stronger visual transition without reintroducing mobile scroll jank.
  - Fix: two fully original generated mood scenes were added. Desktop uses very low-rate frame-scheduled parallax; mobile renders both scenes statically.

## Required fidelity surfaces

- Typography: mobile heading scale, line height and wrapping corrected; exact iPhone Safari font rasterization remains to be checked.
- Spacing/layout: desktop card widths measured equally at 880 px; mobile CSS assigns one identical width and 4:3 image frame to all slides.
- Colors/tokens: cobalt accent retained; glass changed from opaque grey cards to one transparent dark surface with restrained white edge and shadow.
- Image quality: all live images loaded without broken resources; GIANT remains the generated fully assembled JPEG. Both new 1536 × 1024 mood images loaded successfully and are below 100 KB each.
- Copy/content: Freelance positioning, service scope and conversion CTA added without invented client numbers or availability claims.

## Primary interactions tested

- Selected Works next control advanced 01 → 02 → 03 and aligned GIANT as the active slide.
- Project counter updated to `03`.
- Freelancer section and both CTA targets are present.
- No website-origin console errors were observed; one unrelated browser-extension metadata error was ignored.
- No broken images or document-level horizontal overflow were observed at the desktop viewport.
- The new full-width mood transition and the Freelance mood image were visually inspected in the browser at 1363 × 936 CSS px.

## Comparison history

1. User evidence showed split carousel alignment, inconsistent image stages, tight headline leading and oversized grey glass cards.
2. The layout, navigation math, glass composition and scroll system were rebuilt.
3. Post-fix desktop browser evidence confirms equal project-card widths, working carousel navigation, loaded imagery and the complete Freelancer section.
4. A same-state, same-viewport iPhone comparison is still unavailable and must be confirmed from a refreshed user capture.
5. The later iPhone capture exposed residual product cropping and a visible neighboring card; both mobile rules were replaced with single-card/full-product presentation.
6. Post-fix desktop evidence confirms both original mood scenes load and the low-rate parallax composition remains visually stable. Exact iPhone confirmation is still pending.

final result: blocked
