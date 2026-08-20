# Validation Results: Fix VR Eye Merge

## Runtime Checks

Three.js version: r185 (`three@0.185.0`)
Local script version query: `v=20260820-2`

## Diagnostic Pair

Diagnostic left marker: magenta left chevron
Diagnostic right marker: cyan right cross
Expected left eye: left eye sees only the magenta chevron
Expected right eye: right eye sees only the cyan cross

## Headset Validation

Device: not run in this environment
Browser: not run in this environment
Three.js version: r185 (`three@0.185.0`)
Left eye observed: pending real headset validation
Right eye observed: pending real headset validation
Merged image observed: pending real headset validation
Same image observed in both eyes: pending real headset validation
Opposite-eye leakage observed: pending real headset validation
Result: pending
Notes: This environment cannot verify physical headset output. Run Scenario 3 and Scenario 4 from `quickstart.md` on the target WebXR headset before accepting the VR fix.

## Browser View Validation

Scenario 2 result: code-level independence verified; interactive browser edit validation pending
Left-only browser edit observed: pending manual browser validation
Right-only browser edit observed: pending manual browser validation
Notes: `src/config.js` updates one eye key at a time, `src/app.js` refreshes controls/summaries from that state, and `src/preview.js` renders left/right previews from separate configuration objects.

## Unsupported Or Failed VR Validation

Scenario 5 result: pass in headless Chrome unsupported-WebXR smoke test
Configuration preserved after failed or unsupported VR: pass by code path and smoke test
Notes: Headless Chrome loaded `index.html` without module errors and reported "Immersive VR is not supported on this device. Configuration remains available."

## Pass Criteria

Pass requires all of the following:

- Left physical eye sees the left diagnostic marker and no right diagnostic marker.
- Right physical eye sees the right diagnostic marker and no left diagnostic marker.
- No physical eye sees both markers.
- The same combined image is not presented to both physical eyes.
- Regular browser controls remain independently editable after diagnostic mode is used.
- Unsupported, declined, or failed VR entry preserves the current configuration.
