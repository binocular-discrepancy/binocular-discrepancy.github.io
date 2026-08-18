# Quickstart: Binocular XR Experiments

## Prerequisites

- A current browser for regular-view validation.
- A WebXR-compatible browser and immersive VR device for end-to-end immersive validation.
- Static file serving from the repository root. GitHub Pages deployment is the target production
  environment.

## Run Locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

The app must also work when served from GitHub Pages over HTTPS after implementation.

## Validate Configuration View

1. Open the page in a regular browser.
2. Confirm the initial screen shows two columns: left eye and right eye.
3. Change the left-eye shape, color, and rotation.
4. Confirm the right-eye settings do not change.
5. Change the right-eye shape, color, and rotation.
6. Confirm both eye configurations are distinguishable in the preview or summary.

Expected outcome: the user can create different left-eye and right-eye configurations in under
2 minutes, and defaults are complete without editing.

## Validate Immersive Fallback

1. Open the page in a browser or device where immersive VR is unavailable, or decline immersive
   permission when prompted.
2. Select Enter VR.
3. Observe the page response.

Expected outcome: the app remains in the regular browser view, shows a clear status or failure
message, and preserves the current configuration.

## Validate Immersive Per-Eye Presentation

1. Open the page on a WebXR-compatible immersive VR device.
2. Configure intentionally different values for each eye, such as different colors and rotations.
3. Select Enter VR.
4. Grant any browser permission required for immersive entry.
5. Inspect the immersive presentation.
6. Exit the immersive session.

Expected outcome: the left eye receives the left-eye stimulus, the right eye receives the right-eye
stimulus, configured differences remain visible, and exiting returns to the configuration view with
settings retained.

## Validate Static Deployment Boundary

1. Confirm no database, account setup, private service, or server route is required.
2. Confirm all external JavaScript imports use pinned CDN URLs.
3. Confirm all runtime assets are reachable through relative paths suitable for GitHub Pages.

Expected outcome: the feature can be published as static files without custom server configuration.

## Validation Notes

- 2026-08-18: JavaScript syntax checks passed for all modules in `src/`.
- 2026-08-18: Local static serving passed with `python3 -m http.server 8000`.
- 2026-08-18: Headless Chrome loaded the regular browser view, populated left/right controls, showed
  complete per-eye summaries, and reported the unsupported immersive fallback without losing the
  configuration screen.
- 2026-08-18: Desktop and mobile screenshots were generated and pixel-checked as nonblank. Visual
  inspection found no incoherent overlap in the captured viewports.
- 2026-08-18: Module-level configuration validation confirmed per-eye updates remain isolated,
  rotation values clamp to the supported range, and presentation mode updates without remote state.
- 2026-08-18: Immersive per-eye presentation on a compatible VR device was not run because no
  compatible immersive device is available in this execution environment.
