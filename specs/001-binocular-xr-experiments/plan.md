# Implementation Plan: Binocular XR Experiments

**Branch**: `001-binocular-xr-experiments` | **Date**: 2026-08-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-binocular-xr-experiments/spec.md`

## Summary

Build a static, GitHub Pages-compatible website for configuring binocular discrepancy stimuli in a
regular browser view and presenting the configured left-eye and right-eye visuals in an immersive VR
view. Use vanilla HTML, CSS, and JavaScript with a CDN-loaded, pinned Three.js ES module for 3D scene
rendering and WebXR session integration. Keep all experiment state local to the page runtime.

## Technical Context

**Language/Version**: HTML Living Standard, CSS, JavaScript ES modules running in current evergreen
browsers with WebXR support where available

**Primary Dependencies**: Vanilla browser APIs; Three.js ES module and WebXR helper modules loaded
from a pinned CDN URL

**Storage**: In-memory state for v1; optional browser-local persistence may be added only if it
remains nonessential and resettable

**Testing**: Manual browser validation, browser DevTools device checks, static file smoke test, and
immersive-device validation for WebXR behavior

**Target Platform**: GitHub Pages static hosting; regular browser view on desktop/mobile browsers;
immersive VR on browsers/devices that support WebXR immersive VR

**Project Type**: Static web application

**Performance Goals**: Configuration view responds immediately to user edits; immersive rendering
targets device refresh rate for simple starter stimuli, with no visible frame stalls during default
scenes

**Constraints**: No database, no backend, no accounts, no private remote services, no build step
required for baseline operation, and explicit user action required before entering immersive mode

**Scale/Scope**: Single-page experiment tool with two eye configuration panels, a starter library of
regular 2D and 3D shapes, per-eye color and rotation, default static/animated presentation, and
fallback behavior when immersive VR is unavailable

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Static Deployment Boundary**: PASS. Planned source is static HTML, CSS, and JavaScript deployable
  on GitHub Pages without custom server runtime.
- **Self-Contained Runtime**: PASS. Experiment configuration is page-local and does not require a
  database or writable remote storage.
- **CDN-Loaded External JavaScript**: PASS. External JavaScript is limited to pinned CDN imports for
  Three.js and documented in `research.md`.
- **Dual View Parity**: PASS. The regular browser view covers all configuration workflows; WebXR is
  only used for immersive presentation.
- **Progressive WebXR Enhancement**: PASS. The plan gates immersive entry behind an Enter VR action
  and preserves regular-view fallback behavior.

Post-design re-check: PASS. `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md` keep the
same static-host, no-database, regular-browser plus WebXR constraints.

## Project Structure

### Documentation (this feature)

```text
specs/001-binocular-xr-experiments/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
styles.css
src/
├── app.js
├── config.js
├── preview.js
├── stimuli.js
└── xr-session.js
```

**Structure Decision**: Use a single static web application at the repository root so GitHub Pages can
serve it directly. Keep JavaScript split by responsibility: configuration state, stimulus catalog,
regular browser preview, app wiring, and immersive session handling.

## Complexity Tracking

No constitution violations or complexity exceptions are required.
