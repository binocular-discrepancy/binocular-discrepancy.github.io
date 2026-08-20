# Research: Fix VR Eye Merge

## Decision: Replace Three.js `0.170.0` With A Fixed Release

**Decision**: Update the pinned CDN Three.js dependency from `0.170.0` to a fixed current release, preferably `0.185.0` unless implementation testing reveals a breaking change in the app's small API surface.

**Rationale**: The shared ChatGPT conversation pointed to a concrete Three.js WebXR layer regression. Primary source verification confirms issue #31434: starting with r170, each XR eye could render both the left-eye layer and right-eye layer instead of only its assigned eye layer. The current app is pinned to `three@0.170.0`, exactly the bad version named in the report. PR #31437 fixed the exclusive eye-layer behavior and was merged for the r179 milestone. PR #32626 later corrected layer inheritance while preserving inherited layers. The safest path is to leave the app's architecture intact but move off the known-bad release to a release that contains both fixes.

**Alternatives considered**:

- **Stay on `0.170.0` and patch app-layer camera masks**: Rejected because the observed headset behavior still fails and the regression is inside Three.js WebXR camera handling.
- **Downgrade to `0.169.0`**: Rejected as a possible emergency fallback only; r169 predates the regression but also forfeits later WebXR fixes.
- **Rewrite raw WebXR/WebGL rendering**: Rejected as the first path because the failure is explained by a known Three.js version regression and can likely be resolved with a pinned dependency update.
- **Use custom shaders for per-eye branching**: Rejected because shader branching would still depend on reliable per-eye render state and adds complexity without addressing the known dependency bug.

**Sources**:

- Shared ChatGPT conversation: https://chatgpt.com/share/6a86cf23-6248-83eb-9911-7135d916a116
- Three.js issue #31434: https://github.com/mrdoob/three.js/issues/31434
- Three.js PR #31437: https://github.com/mrdoob/three.js/pull/31437
- Three.js PR #32626: https://github.com/mrdoob/three.js/pull/32626
- Three.js releases: https://github.com/mrdoob/three.js/releases

## Decision: Keep Three.js Layers As The Primary Per-Eye Mechanism After Upgrade

**Decision**: Continue assigning left-only content to layer 1, right-only content to layer 2, and shared environment content to layer 0. Remove local per-frame XR sub-camera mutation and rely on the fixed Three.js WebXRManager behavior.

**Rationale**: Three.js WebXRManager exposes the active XR camera as an `ArrayCamera` with one camera per XR view. The fixed WebXRManager behavior is specifically intended to make layer 1 visible only to the left eye and layer 2 visible only to the right eye when inherited camera layers are enabled.

**Alternatives considered**:

- **Directly mutate `renderer.xr.getCamera(camera).cameras` each frame**: Rejected because this duplicates WebXRManager internals and can race against or be overwritten by Three.js camera updates.
- **Duplicate full scenes per eye**: Rejected for now because fixed eye layers provide simpler separation while preserving shared environment objects.

**Sources**:

- Three.js WebXRManager docs: https://threejs.org/docs/pages/WebXRManager.html
- Three.js PR #31437: https://github.com/mrdoob/three.js/pull/31437

## Decision: Add A Diagnostic Stimulus Pair And Validation Record

**Decision**: Add a documented diagnostic setup with unmistakable left-only and right-only markers, then require headset validation evidence before considering the feature complete.

**Rationale**: Desktop/headless browser checks cannot prove physical eye output. The previous fix passed static checks but failed on the headset, so the acceptance path must include a diagnostic that visibly fails if both eyes still receive the same combined image.

**Alternatives considered**:

- **Rely on normal shape/color configurations only**: Rejected because ordinary content can be ambiguous under binocular fusion or when viewed casually.
- **Skip validation record**: Rejected because the spec explicitly requires evidence recording after a previous false fix.

## Decision: Keep Raw WebXR As A Fallback Contingency

**Decision**: Plan for a fallback raw WebXR/WebGL render path only if the fixed Three.js dependency still fails on the target headset.

**Rationale**: Raw WebXR can render per `XRView` using the view's `eye` value and the view-specific viewport, but it would require more custom rendering code. Given the known Three.js r170 regression, dependency correction should be attempted and validated first.

**Alternatives considered**:

- **Implement raw WebXR immediately**: Rejected because it creates more code and bypasses existing Three.js geometry/material/preview logic before proving that the fixed dependency is insufficient.
