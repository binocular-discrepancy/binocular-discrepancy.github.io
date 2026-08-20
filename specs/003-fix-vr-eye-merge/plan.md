# Implementation Plan: Fix VR Eye Merge

**Branch**: `003-fix-vr-eye-merge` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-fix-vr-eye-merge/spec.md`

## Summary

Fix the persistent VR merged-eye rendering by replacing the current known-bad Three.js `0.170.0` dependency with a fixed Three.js release and validating on a real headset with diagnostic left-only/right-only stimuli. Research from the shared ChatGPT conversation and primary sources points to Three.js issue #31434: beginning with r170, both layer 1 and layer 2 could be rendered to both eyes. The plan keeps the static Three.js architecture, updates the CDN import map to a release containing the merged fixes, removes fragile local layer workarounds, and adds a diagnostic validation path that fails clearly if both eyes still receive a combined image.

## Technical Context

**Language/Version**: Browser JavaScript ES modules, HTML, CSS

**Primary Dependencies**: Three.js from CDN via import map; browser WebXR Device API

**Storage**: In-memory browser state only; no persisted state required

**Testing**: Static browser validation for regular view and unsupported WebXR fallback; mandatory real-headset VR validation with diagnostic left/right stimuli; optional console validation of XR camera layer masks

**Target Platform**: Static GitHub Pages deployment; modern browser regular view; WebXR-compatible VR headset/browser for immersive mode

**Project Type**: Static frontend web application

**Performance Goals**: Diagnostic VR mode should enter within 30 seconds of user action and render at the headset's normal WebXR frame cadence without introducing additional network services or build steps

**Constraints**: Static deployment only, no server runtime, no database, no private remote services, explicit CDN dependency versioning, WebXR entered only after user action with regular-view fallback

**Scale/Scope**: Single-page app with one regular browser configuration workflow and one immersive VR workflow; feature scope is dependency correction, per-eye assignment integrity, diagnostic validation, and fallback preservation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Static Deployment Boundary**: PASS. The plan changes static HTML/JS only and keeps GitHub Pages compatibility.
- **Self-Contained Runtime**: PASS. State remains browser-local and recoverable.
- **CDN-Loaded External JavaScript**: PASS. Three.js remains CDN-loaded and must be pinned to an explicit fixed version.
- **Dual View Parity**: PASS. Regular browser configuration remains the source of truth and fallback.
- **Progressive WebXR Enhancement**: PASS. VR remains capability-gated and entered only after explicit user action.

## Project Structure

### Documentation (this feature)

```text
specs/003-fix-vr-eye-merge/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── vr-eye-isolation.md
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

**Structure Decision**: Keep the existing static single-page app. Implementation should update the Three.js import map in `index.html`, keep local module cache-busting aligned, simplify `src/xr-session.js` around the fixed Three.js WebXR layer behavior, and add diagnostic stimulus/validation support using existing `src/config.js` and `src/stimuli.js` patterns.

## Complexity Tracking

No constitution violations require justification.

## Post-Design Constitution Check

- **Static Deployment Boundary**: PASS. Design artifacts require only static file changes.
- **Self-Contained Runtime**: PASS. Diagnostic validation records can be documented locally without backend storage.
- **CDN-Loaded External JavaScript**: PASS. Research chooses a pinned CDN Three.js release containing the WebXR layer fixes.
- **Dual View Parity**: PASS. Contracts and quickstart include regular browser validation and fallback.
- **Progressive WebXR Enhancement**: PASS. Quickstart requires unsupported/failure validation and headset validation only for immersive behavior.
