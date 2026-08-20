# UI Contract: VR Eye Presentation

## Contract Scope

This contract defines observable behavior for the regular browser configuration view and immersive VR presentation. It is not an external network API.

## Enter VR With Different Per-Eye Configuration

**Preconditions**:

- The regular browser view is loaded.
- Immersive VR is supported and available.
- The left-eye and right-eye configurations differ in at least one supported property.

**Action**:

- The user selects Enter VR.

**Expected Outcome**:

- The immersive session starts only after user action.
- The left eye sees only the stimulus generated from the left-eye configuration.
- The right eye sees only the stimulus generated from the right-eye configuration.
- Shared environment content may appear to both eyes.
- The two configured stimuli are not blended, averaged, overlaid, or merged into a shared image.

## Enter VR With Identical Per-Eye Configuration

**Preconditions**:

- The regular browser view is loaded.
- Immersive VR is supported and available.
- The left-eye and right-eye configurations are intentionally identical.

**Action**:

- The user selects Enter VR.

**Expected Outcome**:

- Both eyes display matching stimuli.
- The app still treats the two eye assignments as separate internally and remains able to show a later one-eye change only to that eye.

## Change One Eye And Re-Enter VR

**Preconditions**:

- The user has returned from a previous VR session.
- The user changes one eye's shape, color, rotation, or presentation-relevant value.

**Action**:

- The user selects Enter VR again.

**Expected Outcome**:

- The next immersive session reflects the latest changed value for the changed eye.
- The unchanged eye continues to use its existing configuration.

## Unsupported Or Failed VR Entry

**Preconditions**:

- Immersive VR is unsupported, unavailable, declined, or fails to start.

**Action**:

- The user attempts to enter VR.

**Expected Outcome**:

- The app remains in the regular browser view.
- The current left-eye and right-eye configuration values are preserved.
- The user receives an in-page status message.

## Validation Observations

- 2026-08-20 local headless Chrome validation: immersive VR was unavailable, the Enter VR button rendered disabled, the in-page status reported unavailable immersive support, and the regular browser configuration view remained usable.
