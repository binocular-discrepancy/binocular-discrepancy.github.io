# Implementation Plan: Fix VR Eye Images

**Branch**: `002-fix-vr-eye-images` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-fix-vr-eye-images/spec.md`

## Summary

Fix immersive presentation so different left-eye and right-eye configurations remain isolated in VR instead of appearing as a merged stimulus. Research confirms this is achievable while keeping Three.js: Three.js WebXRManager exposes an XR `ArrayCamera` with a separate camera per XR view and already assigns layer 1 to the left eye and layer 2 to the right eye. The implementation should tighten the current Three.js layer-based path, remove assumptions that can allow both stimuli to render to both eyes, and add observable validation scenarios for different and identical per-eye configurations.

## Technical Context

**Language/Version**: Browser JavaScript ES modules, HTML, CSS

**Primary Dependencies**: Three.js `0.170.0` loaded from jsDelivr CDN via import map; browser WebXR Device API

**Storage**: In-memory browser state only; no persistence required for this fix

**Testing**: Manual browser validation for regular view; manual compatible-headset validation for immersive VR; optional browser console instrumentation during VR to confirm XR camera/view counts and eye layer assignment

**Target Platform**: Static website on GitHub Pages; regular browser view on modern browsers; immersive VR on WebXR-compatible secure contexts

**Project Type**: Static frontend web application

**Performance Goals**: Maintain comfortable immersive rendering at the device's requested XR frame cadence; entering VR after configuration change should show latest per-eye values within 30 seconds as specified

**Constraints**: No server runtime, no database, no private remote services, no build-only dependency graph, WebXR must be capability-gated and entered only from explicit user action

**Scale/Scope**: Single-page app with one configuration workflow and one immersive VR presentation workflow; fix covers currently supported stimuli: shape, color, rotation, and static/animated mode

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Static Deployment Boundary**: PASS. The plan keeps the app as static HTML/CSS/JS deployable to GitHub Pages.
- **Self-Contained Runtime**: PASS. Configuration remains in browser memory; no backend or writable remote storage is introduced.
- **CDN-Loaded External JavaScript**: PASS. Three.js remains the only external dependency and is already pinned in the import map.
- **Dual View Parity**: PASS. Regular browser configuration and previews remain available while WebXR receives the per-eye rendering fix.
- **Progressive WebXR Enhancement**: PASS. Immersive mode remains capability-gated and entered by explicit user action, with fallback status in the regular view.

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-vr-eye-images/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── vr-eye-presentation.md
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

**Structure Decision**: Use the existing static single-page structure. The implementation should be concentrated in `src/xr-session.js` and, only if needed, shared stimulus helpers in `src/stimuli.js`. No new framework, build system, shader pipeline, or runtime service is planned.

## Complexity Tracking

No constitution violations require justification.

## Post-Design Constitution Check

- **Static Deployment Boundary**: PASS. Design artifacts require only static source changes.
- **Self-Contained Runtime**: PASS. Data model is browser-local and ephemeral.
- **CDN-Loaded External JavaScript**: PASS. Research chooses the existing pinned Three.js dependency.
- **Dual View Parity**: PASS. Contracts include both regular browser fallback and immersive VR behavior.
- **Progressive WebXR Enhancement**: PASS. Quickstart includes unsupported/failure validation.
