# Quickstart: Fix VR Eye Images

## Prerequisites

- A modern browser for regular view validation.
- A secure context for WebXR validation: GitHub Pages, HTTPS, or localhost.
- A WebXR-compatible VR headset/browser combination for immersive validation.

## Run Locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

## Scenario 1: Regular Browser Configuration Still Works

1. Open the app in a regular browser view.
2. Change only the left-eye color.
3. Confirm the left preview and left summary update.
4. Confirm the right preview and right summary remain unchanged.
5. Change only the right-eye shape or rotation.
6. Confirm the left side remains unchanged.

**Expected result**: Regular configuration parity is preserved and each eye remains independently configurable.

## Scenario 2: Different Per-Eye Colors In VR

1. Configure the left eye to a clearly red stimulus.
2. Configure the right eye to a clearly blue stimulus.
3. Enter VR on a compatible headset.
4. Close or cover one eye at a time if needed to validate eye assignment.

**Expected result**: The left eye sees only the red stimulus and the right eye sees only the blue stimulus. No blended, overlaid, or shared combined stimulus is observed.

## Scenario 3: Different Per-Eye Shapes And Rotations In VR

1. Configure the left eye to a 2D shape with a distinctive rotation.
2. Configure the right eye to a 3D shape with a different distinctive rotation.
3. Enter VR.

**Expected result**: Each eye sees the configured shape and rotation for that eye only.

## Scenario 4: Identical Control Configuration

1. Configure both eyes to the same shape, color, and rotation.
2. Enter VR.
3. Exit VR.
4. Change only the right-eye color.
5. Enter VR again.

**Expected result**: The first session shows matching stimuli in both eyes. The second session shows the changed color only in the right eye.

## Scenario 5: Unsupported Or Failed VR

1. Open the app in a browser or context where immersive VR is unavailable.
2. Configure different left-eye and right-eye values.
3. Attempt to enter VR if the control is available, or observe the disabled state and status message.

**Expected result**: The app remains in the regular browser view, reports unavailable immersive support, and preserves both configurations.

## Validation Notes

- Use [contracts/vr-eye-presentation.md](./contracts/vr-eye-presentation.md) as the behavioral contract for acceptance.
- Use [data-model.md](./data-model.md) to confirm configuration and session state remain separate.
- Headset validation is required for final confidence because the defect is specific to immersive presentation.
