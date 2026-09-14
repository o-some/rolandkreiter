# Design QA — Mobile project-gallery revision

Date: 13 September 2026

## Source visual truth

- `/workspace/scratch/8f206493c8a0/upload/BF595EE1-B499-4FBD-B61A-3B8C683C641F.jpeg` — mobile project carousel, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/F173346C-19EF-4038-9B08-546912B5A66C.jpeg` — mobile intro typography, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/AE3A8CEF-01AD-4432-8798-60C669D79504.jpeg` — mobile glass treatment, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/B3B027D5-8034-4644-812D-C0E2FD2D8DAF.jpeg` — mobile product crop and split-card alignment, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/022000F0-7103-4ED7-9D0F-255017FE0E3B.jpeg` — mobile gallery at card 05 and blocked vertical-scroll region, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/E93751EA-C5F9-4FC5-B7A0-369037244F15.jpeg` — mobile gallery stopped between AromaPour and GIANT, 707 × 1536 px.
- `/workspace/scratch/8f206493c8a0/upload/E345136D-45A0-4D9C-A810-EA222578C52E.jpeg` — mobile gallery visibly communicates horizontal navigation while swipe is disabled, 707 × 1536 px.

The supplied captures include iPhone Safari chrome and appear to be approximately 2× density. The exact CSS viewport could not be reproduced by the available cloud browser.

## Implementation evidence

- Live implementation: `https://o-some.github.io/rolandkreiter/?release=93179bb`
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
- [P1] The project track captured vertical finger movement on iPhone because its mobile `touch-action` was restricted to horizontal panning.
  - Fix: the mobile track now uses `touch-action: pan-y`, hides manual horizontal overflow and leaves card changes to the explicit Previous/Next controls. Vertical page scrolling can begin anywhere over the gallery.
- [P1] A manual swipe could stop between two slides, exposing clipped imagery, headings and body copy from adjacent cards.
  - Fix: free mobile swiping was removed; every button step targets one exact slide offset. Each slide also uses `scroll-snap-stop: always` as a defensive desktop/tablet fallback.
- [P1] Three project images used portrait or extra-wide source ratios while GIANT and Impact used 3:2.
  - Fix: mysqueeze, AromaPour and Daily rituals were re-composed as new 1536 × 1024 derivatives. GIANT and Impact were retained, so all five gallery assets are now exactly 3:2 without rebuilding the already correct two.
- [P1] The follow-up mobile state still advertised a carousel but horizontal touch navigation had been removed.
  - Fix: native horizontal overflow and iOS momentum scrolling are restored with `touch-action: auto`, while mandatory snap and `scroll-snap-stop` keep one complete card at rest. A `scrollend` correction aligns the nearest card without interrupting button animations.
- [P2] The interaction state was not visible beyond the numeric counter.
  - Fix: a restrained native progress line now advances from 1 to 5, and Previous/Next disable correctly at the boundaries. The instruction now accurately names both swipe and button navigation.

## Required fidelity surfaces

- Typography: mobile heading scale, line height and wrapping corrected; exact iPhone Safari font rasterization remains to be checked.
- Spacing/layout: desktop card widths measured equally at 880 px; mobile CSS assigns one identical card width and 3:2 image frame to all slides. Wide-class cards now use the same desktop grid ratio as the other cards.
- Colors/tokens: cobalt accent retained; glass changed from opaque grey cards to one transparent dark surface with restrained white edge and shadow.
- Image quality: all five live gallery images loaded at 1536 × 1024 without broken resources; GIANT remains the generated fully assembled JPEG. The three new derivatives keep each complete product inside a generous safe frame.
- Copy/content: Freelance positioning, service scope and conversion CTA added without invented client numbers or availability claims.

## Primary interactions tested

- Selected Works next control advanced through all five slides; the counter settled at `05` and the last card reached the track's valid end position.
- A direct 01 → 02 live test aligned the track exactly at 904 px, updated the progress value to `2`, and enabled both direction controls.
- Repeated navigation reached project `05`; Next disabled at the boundary and the track settled at its valid maximum scroll position.
- Every gallery image reported a 1536 × 1024 natural size on the live deployment.
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
7. New iPhone evidence showed that `touch-action: pan-x` blocked vertical scrolling and native swipe could leave the carousel between cards.
8. Mobile touch handling was changed to vertical page panning plus button-only card navigation, and the three ratio outliers were rebuilt as exact 3:2 assets.
9. Post-fix live desktop evidence confirms versioned CSS `v=10`, five 1536 × 1024 gallery images, successful navigation to card 05 and zero document-level horizontal overflow. A refreshed same-state iPhone capture remains required for a valid mobile comparison.
10. The newest iPhone evidence showed the usability contradiction created by disabling native swipe while retaining carousel cues.
11. Native swipe was restored with two-axis gesture recognition, mandatory one-card snapping, end-of-scroll correction, boundary states and a minimal progress line. Live desktop interaction checks confirm exact button alignment and correct 1–5 state updates; exact iPhone touch verification remains pending.

final result: blocked
