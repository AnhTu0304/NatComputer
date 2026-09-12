# NAT Computer — Homepage Redesign

Date: 2026-08-16
Status: Approved by user (chat)
Path chosen: Approach A — refactor components + hand-built carousel + react-router

## Context

E-commerce homepage for a PC store (NAT Computer). Current homepage mixes many sections on a single page, including AI assistant and 3D configurator. Requirement is a cleaner homepage:

- White hero banner introducing the **Build PC 3D** feature (visual only — no real API integration).
- 4 category sections, each a white rounded container on a light-gray background, showing product cards with spec tables in a horizontal carousel (5 cards visible per row, draggable).
- Commitment section + Showroom section.
- AI assistant + build wizard moved off the homepage to a dedicated `/ai` page.
- 3D configurator moved to a dedicated `/build` page.
- Rebuild the entire body; keep Navbar, Footer, CartDrawer, QuickViewModal, ThreeDCanvas.
- Keep BMW Blue theme (`#1c69d4`) and existing design tokens.

## Routing

- Add `react-router-dom` v6, `BrowserRouter`.
- `/` → `HomePage` (new body)
- `/ai` → `AiPage` = Navbar + `AiAssistantSection` + `BuildWizardPreview` + Footer
- `/build` → `BuildPage` = Navbar + `ThreeDBuilderSection` + Footer
- Deploy note: static hosts need SPA fallback; fallback to `HashRouter` if not available.

## Navbar changes

- `AI Tư Vấn` → `/ai`
- `3D Config` → `/build`
- Add `Showroom` → `#showroom`
- Keep existing links where sensible (`#products` removed since ProductShowcase is gone).

## Homepage body (new order)

1. `HeroBanner` — white background. Intro of "Build PC 3D + AI tư vấn": live 3D frame (reuses `ThreeDCanvas`), heading, description, 2 CTAs: "BUILD PC 3D NGAY" → `/build`, "NHẬN TƯ VẤN AI" → `/ai`.
2. `CategoryCarousel` × 4 — shared component:
   - PC Gaming, PC Văn Phòng, Linh Kiện, Màn Hình.
   - White container, `border-radius: 14px`, padding ~20px, on `#f5f5f5` background, near full-width.
   - Header: eyebrow + title + "Xem tất cả" link.
   - Horizontal row: 5 cards visible, CSS scroll-snap, drag + left/right buttons.
   - Card: image, name, spec table (CPU/GPU/RAM/SSD), price, "Cấu hình chi tiết" button (add to cart / quick view).
3. `CommitmentSection` — commitments: warranty, 1:1 swap, genuine parts, fast delivery (4–6 cells).
4. `ShowroomSection` — showroom list + contact info, id `showroom`.

## Data

- New file `src/data/catalogData.js` with 4 groups: `GAMING_PCS`, `OFFICE_PCS`, `COMPONENTS`, `MONITORS`.
- Structure: id, name, badge, image, specs { cpu, gpu, ram, ssd }, price, originalPrice, rating, categoryName.
- Seed 2–3 placeholder items per group; user will fill real data later.

## Components removed from homepage

`BrandTicker`, `ProductShowcase`, `Testimonials`, `ComponentLibrary`, `AiAssistantSection`, `BuildWizardPreview`, `ThreeDBuilderSection` (moved to `/build`).

## Kept

`Navbar`, `Footer`, `CartDrawer`, `QuickViewModal`, `ThreeDCanvas`, `ThreeDBuilderSection` (relocated), `AiAssistantSection` + `BuildWizardPreview` (relocated).

## CSS

- Add classes for carousel (`.carousel-shell`, `.carousel-track`, `.carousel-card`, nav buttons, scroll-snap) and new sections to `src/index.css` using existing tokens (`--c-*`, `--sp-*`, `.section-*`).
- Light-gray page background `#f5f5f5` for homepage body; white section cards.

## Testing

- Update `App.test.js` to reflect new structure (HomePage renders HeroBanner + 4 carousels).
- Add carousel scroll test, routing smoke test (render `/ai`, `/build`).
- Run `npm test`, `npm run build`.

## Error handling

- Carousel: handle fewer-than-5 items gracefully (no overflow).
- Routing: unknown routes → redirect to `/`.

## Out of scope

- Real 3D model API integration (banner is visual only).
- Real product data (placeholders only; user supplies later).
- Actual AI backend (existing simulated presets kept as-is).