# Research: Fix VR Eye Images

## Decision: Keep Three.js And Fix The Per-Eye Layer Path

**Decision**: Continue using Three.js `0.170.0` for WebXR rendering. Implement the fix by making per-eye stimulus visibility depend on Three.js camera layers: left-eye stimulus on layer 1, right-eye stimulus on layer 2, common environment on layer 0, with the XR camera left and right sub-cameras isolated to the correct eye layers.

**Rationale**: Three.js WebXRManager is not too high-level for this requirement. The official docs state that `renderer.xr.getCamera()` returns an `ArrayCamera` for the active XR session and that it holds a separate camera object for each view. The current Three.js source also explicitly documents and applies the convention that layer 1 is left and layer 2 is right, then masks those layers away from the opposite eye camera. This directly matches the app's need to show different configured objects to different eyes.

**Alternatives considered**:

- **Raw WebXR and WebGL**: Gives direct control by iterating `XRViewerPose.views`, reading `XRView.eye`, setting each viewport, and drawing left or right content accordingly. Rejected for this fix because Three.js already exposes the needed stereo camera separation while preserving the existing geometry/material code and static deployment shape.
- **Custom shader in Three.js**: Could branch per eye if an eye identifier is supplied to shader uniforms. Rejected because it is more complex than object-level visibility layers and does not solve the likely root issue as clearly.
- **Remove Three.js for another library**: Rejected because the current app already depends on Three.js for scene, materials, geometry, previews, and WebXR session integration. Another rendering library would add migration risk without providing a clearer per-eye primitive than WebXR views and camera layers.
- **WebVR-specific implementation**: Rejected because WebVR is legacy; the current browser-facing immersive path is WebXR.

**Primary sources**:

- Three.js WebXRManager docs: https://threejs.org/docs/pages/WebXRManager.html
- Three.js WebXRManager source: https://raw.githubusercontent.com/mrdoob/three.js/master/src/renderers/webxr/WebXRManager.js
- W3C WebXR Device API: https://www.w3.org/TR/webxr/
- MDN XRView reference: https://developer.mozilla.org/en-US/docs/Web/API/XRView

## Decision: Treat `XRView.eye` As The Standards Reference, Not The First Implementation Path

**Decision**: Use `XRView.eye` semantics as the correctness model and debugging reference. Do not implement a raw WebXR render loop unless Three.js layer isolation fails on a target headset.

**Rationale**: The WebXR specification defines `XRView.eye` as the mechanism for describing whether a view is intended for the left eye, right eye, or neither. MDN also describes the render loop as drawing each `XRView` into the appropriate viewport. This proves the feature is achievable at the WebXR level. However, Three.js already maps WebXR views into sub-cameras and layers, so the lower-level API should remain a fallback path rather than the primary implementation.

**Alternatives considered**:

- **Index-based eye mapping only**: Rejected as the architecture rule because the WebXR spec warns not to assume a fixed number or order of views across devices. Three.js currently exposes layer conventions on the left and right cameras, but validation should still be framed around eye semantics.
- **Per-eye duplicated scenes**: Rejected for now because separate object layers in one scene are simpler and avoid duplicating environment, lighting, and animation state.

## Decision: Validate Both Discrepant And Identical Configurations

**Decision**: Validation must include intentionally different configurations and intentionally identical control configurations.

**Rationale**: The reported bug appears as an unintended merged image. A successful fix must prove that different values remain different per eye while identical values still display identically when chosen by the user.

**Alternatives considered**:

- **Only test different colors**: Rejected because the feature requirements cover shape, color, rotation, and animation mode where applicable.
- **Only test on desktop regular view**: Rejected because the bug is specific to immersive VR presentation.

## Decision: Keep The Regular Browser View Untouched Except For Status Or Debug Affordances If Needed

**Decision**: Preserve the existing configuration and preview workflow. Only add non-disruptive status or debug reporting if needed to validate headset behavior.

**Rationale**: The defect is scoped to immersive VR presentation. The constitution requires WebXR to remain an enhancement and the regular browser workflow to stay usable when WebXR is unavailable.

**Alternatives considered**:

- **Redesign configuration UI**: Rejected as out of scope for this fix.
- **Persist configurations**: Rejected as unrelated to the reported defect and not required by the spec.
