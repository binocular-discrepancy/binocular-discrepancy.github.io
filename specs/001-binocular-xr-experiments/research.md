# Research: Binocular XR Experiments

## Decision: Use Vanilla Static Web Files

Use `index.html`, `styles.css`, and JavaScript ES modules without a build step for the baseline app.

**Rationale**: The project constitution and user input require GitHub Pages deployment, no database,
and vanilla HTML/CSS/JavaScript. A no-build static layout is the shortest path to reliable hosting
and keeps the app inspectable.

**Alternatives considered**:

- Frontend framework with static export: rejected for v1 because the app is small and the user asked
  for vanilla HTML, CSS, and JavaScript.
- Bundled build pipeline: rejected for baseline delivery because it adds deployment complexity that
  is not needed for a single-page experiment tool.

## Decision: Use Three.js from a Pinned CDN URL

Use Three.js as an ES module from a CDN, pinned to an explicit version during implementation. Include
any Three.js WebXR helper modules from the same pinned version and CDN origin.

**Rationale**: The app needs regular 2D/3D stimulus previews and immersive VR presentation. Three.js
provides mature WebGL scene primitives and WebXR session integration while still fitting the user's
allowance for CDN-loaded external JavaScript. Pinning the URL preserves repeatable GitHub Pages
behavior.

**Alternatives considered**:

- Raw WebGL/WebXR only: rejected because per-eye rendering, geometry setup, and immersive frame
  management would consume disproportionate effort for v1.
- A higher-level WebXR framework: rejected because it would add framework conventions beyond the
  requested vanilla static page.

## Decision: Represent Per-Eye Stimuli as Separate Scene Objects

Create separate left-eye and right-eye stimulus objects from the same configuration schema. In
immersive mode, render the appropriate object for each eye-specific view. The implementation may use
renderer-supported stereo camera/layer behavior when reliable and must fall back to explicit per-view
visibility based on each view's eye value if needed.

**Rationale**: The main technical risk is showing different visuals to each eye. The WebXR model
exposes views with eye values such as left and right, and rendering must treat those views separately
instead of assuming one shared image. Separate stimulus objects keep differences in shape, color,
rotation, and animation explicit.

**Alternatives considered**:

- Single shared stimulus object with conditional material changes: rejected because it makes per-eye
  differences harder to reason about and test.
- Pre-rendered stereo images only: rejected because the first version needs configurable 2D and 3D
  shapes with independent rotation and color.

## Decision: Keep Configuration In Memory for v1

Keep the active experiment configuration in memory while the page is open. Use complete defaults so
the user can enter an immersive presentation without changing settings.

**Rationale**: The specification only requires configuration for the current experiment and the
constitution forbids required database or remote storage. In-memory state is sufficient for the v1
flow and avoids persistence edge cases.

**Alternatives considered**:

- localStorage persistence: deferred because saved experiments are not required in the current spec.
- URL-encoded configuration: deferred because sharing configurations is not in v1 scope.

## Decision: Progressive Immersive Entry

Detect immersive support on page load, keep the regular configuration view always usable, and request
immersive VR only from the Enter VR user action.

**Rationale**: WebXR immersive sessions require a secure context, device/browser support, and clear
user intent. GitHub Pages provides HTTPS, but unsupported browsers and permission denial must be
normal fallback states.

**Alternatives considered**:

- Auto-enter immersive mode: rejected because it conflicts with user activation and consent
  expectations.
- Hide the configuration page when immersive support is absent: rejected because regular-browser
  configuration remains a core workflow.

## Research References

- MDN documents that `requestSession("immersive-vr")` starts immersive VR through a promise and can
  reject for unsupported devices, permission denial, or invalid state:
  <https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession>
- MDN WebXR permissions guidance states that immersive VR activation requires user intent and an
  active, trusted document:
  <https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Permissions_and_security>
- W3C WebXR defines `XRView.eye` values for eye-specific views and notes that applications must not
  assume a fixed view count or layout:
  <https://www.w3.org/TR/webxr/>
- Three.js WebXRManager documents renderer-level WebXR integration and XR camera management:
  <https://threejs.org/docs/pages/WebXRManager.html>
- Three.js Layers document object/camera visibility filtering that can support per-camera rendering
  decisions when used carefully:
  <https://threejs.org/docs/pages/Layers.html>
