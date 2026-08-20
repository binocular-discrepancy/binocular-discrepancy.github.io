# Feature Specification: Fix VR Eye Merge

**Feature Branch**: `003-fix-vr-eye-merge`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "Same image (left eye merged with right eye) is still presented to each eye in VR mode. This task is to finally fix it."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prove Each Eye Receives Only Its Own Stimulus (Priority: P1)

As an experimenter, I want VR mode to present the left-eye stimulus exclusively to the left eye and the right-eye stimulus exclusively to the right eye, so that binocular discrepancy experiments are valid and do not show the same merged image to both eyes.

**Why this priority**: The app's central purpose is invalid while both eyes receive the same combined visual.

**Independent Test**: Configure the left and right eyes with a diagnostic pair that cannot be mistaken for one another or for a merged image, enter VR, and verify that each physical eye sees only its assigned diagnostic stimulus.

**Acceptance Scenarios**:

1. **Given** the left eye is configured with a clearly left-only diagnostic stimulus and the right eye is configured with a clearly right-only diagnostic stimulus, **When** the user enters VR, **Then** the left eye sees only the left-only stimulus and not the right-only stimulus.
2. **Given** the same diagnostic configuration, **When** the user enters VR, **Then** the right eye sees only the right-only stimulus and not the left-only stimulus.
3. **Given** the same diagnostic configuration, **When** either eye is viewed independently, **Then** neither eye shows a merged, combined, duplicated, or averaged image containing both eye configurations.

---

### User Story 2 - Detect And Reject False Fixes (Priority: P2)

As an experimenter, I want the app to include a validation path that makes accidental merged rendering obvious, so that a fix is not accepted unless it genuinely separates the eyes.

**Why this priority**: A previous fix attempt did not resolve the reported failure, so the next implementation must include stronger evidence of correctness.

**Independent Test**: Use a validation mode or documented diagnostic setup where a merged image is visually obvious and verify that the implementation fails the validation if both eyes receive the same combined view.

**Acceptance Scenarios**:

1. **Given** a diagnostic setup designed to expose merged rendering, **When** both eyes receive the same combined image, **Then** the validation procedure identifies the outcome as a failure.
2. **Given** a diagnostic setup designed to expose merged rendering, **When** each eye receives only its assigned image, **Then** the validation procedure identifies the outcome as a pass.
3. **Given** a reviewer follows the validation procedure, **When** they record results, **Then** the result includes which stimulus appeared to the left eye, which appeared to the right eye, and whether any merged image appeared.

---

### User Story 3 - Preserve Non-VR Configuration And Fallback (Priority: P3)

As an experimenter, I want the regular browser configuration view and unsupported-VR fallback to keep working while the VR eye separation is fixed, so that the app remains usable outside a compatible headset.

**Why this priority**: The project constitution requires WebXR to remain a progressive enhancement and not break the regular browser workflow.

**Independent Test**: Use the regular browser view to configure different eye values, confirm the values remain independent, and attempt VR in an unsupported environment without losing the configuration.

**Acceptance Scenarios**:

1. **Given** the user changes only the left-eye configuration in the regular browser view, **When** the preview and summary update, **Then** the right-eye configuration remains unchanged.
2. **Given** immersive VR is unavailable, declined, or fails to start, **When** the user attempts to enter VR, **Then** the regular browser view remains usable and preserves both eye configurations.

### Edge Cases

- The left and right diagnostic stimuli use highly contrasting content; neither eye may display both diagnostic markers at the same time.
- The left and right eye configurations are intentionally identical; the app must still treat them as separate assignments even though the viewed result matches.
- The user changes one eye immediately before entering VR; the latest value must be assigned only to that eye.
- A VR session is exited and re-entered after changing one eye; the next session must not reuse stale or merged visual content.
- VR is unsupported, declined, or fails to start; the regular browser view remains usable and unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: VR mode MUST present left-eye configured visual content only to the user's left eye.
- **FR-002**: VR mode MUST present right-eye configured visual content only to the user's right eye.
- **FR-003**: VR mode MUST NOT present the same merged, combined, duplicated, averaged, or shared image to both eyes when the configured left and right visuals differ.
- **FR-004**: VR mode MUST preserve per-eye separation for all supported visual differences, including shape, color, rotation, and motion where applicable.
- **FR-005**: The app MUST provide or document a diagnostic validation setup where merged left/right rendering is immediately distinguishable from true per-eye separation.
- **FR-006**: Validation evidence MUST record the observed content for the left eye, the observed content for the right eye, and whether any merged image appeared.
- **FR-007**: The app MUST continue to support intentionally identical left and right configurations as valid control cases.
- **FR-008**: The app MUST use the latest regular browser configuration values when entering VR and must not reuse stale VR-session visuals.
- **FR-009**: Exiting or failing to enter VR MUST preserve the current regular browser configuration values.
- **FR-010**: The regular browser configuration view MUST remain available and independently editable for each eye.
- **FR-011**: The fix MUST remain deployable as a static website without accounts, server-side state, databases, or private remote services.

### Key Entities *(include if feature involves data)*

- **Eye Stimulus Assignment**: The mapping from one configured eye side to the visual content that must be shown only to that physical eye in VR.
- **Diagnostic Stimulus Pair**: A deliberately contrasting left/right configuration used to make merged rendering visually obvious.
- **VR Validation Result**: A recorded outcome that states what appeared to each eye and whether a merged image appeared.
- **Experiment Configuration**: The current browser-side left-eye and right-eye settings used when entering VR.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of diagnostic VR validation trials, a reviewer can identify a left-only stimulus in the left eye and a right-only stimulus in the right eye without observing the opposite-eye stimulus in either eye.
- **SC-002**: In 100% of diagnostic VR validation trials with differing left/right content, neither eye shows a merged image containing both configured stimuli.
- **SC-003**: A reviewer can complete the diagnostic validation procedure and record pass/fail evidence in under 3 minutes after the app is loaded on a compatible VR device.
- **SC-004**: In 100% of tested unsupported or failed VR entry attempts, the regular browser view remains usable and preserves both eye configurations.
- **SC-005**: In intentionally identical control trials, both eyes display matching content while subsequent one-eye changes affect only the changed eye.

## Assumptions

- The previous layer-based implementation did not resolve the real headset behavior, so planning must consider a lower-level rendering path or a more direct per-eye presentation strategy if needed.
- A compatible VR headset is required to prove this feature complete because desktop and headless browser checks cannot observe physical per-eye output.
- The existing regular browser configuration UI remains the source of truth for the left-eye and right-eye settings.
- The app remains a static GitHub Pages-compatible website and WebXR remains an enhancement over the regular browser view.
