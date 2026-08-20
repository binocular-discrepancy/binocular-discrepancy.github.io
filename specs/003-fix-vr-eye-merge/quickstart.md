# Quickstart: Fix VR Eye Merge

## Prerequisites

- Modern browser for regular view validation.
- Secure context for WebXR: localhost, HTTPS, or GitHub Pages.
- WebXR-compatible headset/browser for final validation.

## Run Locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

## Scenario 1: Confirm Fixed Three.js Dependency Loads

1. Open the app.
2. Inspect `index.html`.
3. Confirm the import map no longer points to `three@0.170.0`.
4. Confirm local module URLs use the current app version query.

**Expected result**: The app loads a pinned Three.js release that contains the WebXR eye-layer fixes.

## Scenario 2: Regular Browser Configuration Independence

1. Change only the left-eye color or shape.
2. Confirm only the left preview and summary change.
3. Change only the right-eye color or shape.
4. Confirm only the right preview and summary change.

**Expected result**: The regular browser view remains independently editable for both eyes.

## Scenario 3: Diagnostic VR Eye Isolation

1. Prepare a diagnostic pair with a left-only marker and a right-only marker.
2. Enter VR on a compatible headset.
3. Check the left physical eye independently.
4. Check the right physical eye independently.
5. Record the device, browser, Three.js version, observed left-eye content, observed right-eye content, and whether a merged image appeared.

**Expected result**: Left eye sees only the left marker. Right eye sees only the right marker. Neither eye sees a merged image.

**Failure result**: Mark the validation as failed if either eye sees both markers, if either eye sees the opposite-eye marker, or if both eyes show the same merged or duplicated image.

## Scenario 4: Intentional Identical Control

1. Configure both eyes identically.
2. Enter VR.
3. Confirm both eyes display matching content.
4. Exit VR.
5. Change only the right-eye marker or color.
6. Re-enter VR and validate that only the right eye changes.

**Expected result**: Matching configurations remain valid, and later one-eye changes remain isolated.

## Scenario 5: Unsupported Or Failed VR

1. Open the app in a browser or context where immersive VR is unavailable.
2. Configure different left/right values.
3. Observe the unavailable status or failed entry state.

**Expected result**: The app remains in the regular browser view and preserves both configurations.

## Validation Record Template

```text
Device:
Browser:
Three.js version:
Diagnostic left marker:
Diagnostic right marker:
Left eye observed:
Right eye observed:
Merged image observed: yes/no
Same image observed in both eyes: yes/no
Opposite-eye leakage observed: yes/no
Result: pass/fail
Notes:
```

## References

- Contract: [contracts/vr-eye-isolation.md](./contracts/vr-eye-isolation.md)
- Data model: [data-model.md](./data-model.md)
- Research: [research.md](./research.md)
