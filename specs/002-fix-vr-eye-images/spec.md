# Feature Specification: Fix VR Eye Images

**Feature Branch**: `002-fix-vr-eye-images`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "The goal of this app is to present different image to each eye in the VR mode, but the same image is currently presented (it seems to be merged image from left eye and right eye configuration). This needs to be fixed."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verify Separate VR Eye Presentation (Priority: P1)

As an experimenter, I want the immersive VR view to show the left-eye configuration only to the left eye and the right-eye configuration only to the right eye, so that binocular discrepancy experiments present the intended stimuli.

**Why this priority**: This is the core purpose of the app and the reported defect prevents valid VR experiments.

**Independent Test**: Configure clearly different left-eye and right-eye stimuli, enter VR, and verify that each eye receives only its own configured visual without blending, averaging, or merging with the other eye's configuration.

**Acceptance Scenarios**:

1. **Given** the left-eye and right-eye configurations use different colors, **When** the user enters VR, **Then** the left eye sees only the left-eye color and the right eye sees only the right-eye color.
2. **Given** the left-eye and right-eye configurations use different shapes, **When** the user enters VR, **Then** the left eye sees only the left-eye shape and the right eye sees only the right-eye shape.
3. **Given** the left-eye and right-eye configurations use different rotations, **When** the user enters VR, **Then** each eye sees the rotation configured for that eye without a combined or shared rotation.

---

### User Story 2 - Preserve Same-Image Cases (Priority: P2)

As an experimenter, I want intentionally identical left-eye and right-eye configurations to remain supported, so that normal non-discrepant control trials still work.

**Why this priority**: The fix must distinguish intentional matching stimuli from accidental merged rendering.

**Independent Test**: Configure both eyes identically, enter VR, and verify that both eyes display the same configured stimulus while the system still maintains separate eye assignments.

**Acceptance Scenarios**:

1. **Given** both eye configurations are identical, **When** the user enters VR, **Then** both eyes display matching stimuli.
2. **Given** the user changes one eye after previously matching both eyes, **When** the user enters VR again, **Then** only the changed eye reflects the new configuration.

---

### User Story 3 - Maintain Browser View Fallback (Priority: P3)

As an experimenter without a working VR session, I want the regular browser configuration view to remain usable and consistent, so that I can keep preparing experiments even when immersive mode is unavailable.

**Why this priority**: WebXR is an enhancement and the existing app must remain useful outside VR.

**Independent Test**: Attempt to enter VR in an unsupported or unavailable environment and verify that the app keeps the current left-eye and right-eye configurations intact in the regular browser view.

**Acceptance Scenarios**:

1. **Given** immersive VR is unavailable, **When** the user attempts to enter VR, **Then** the app remains in the regular browser view with both eye configurations preserved.
2. **Given** a VR session ends after showing per-eye stimuli, **When** the user returns to the regular browser view, **Then** the displayed configuration still matches the values used for the VR session.

### Edge Cases

- The left-eye and right-eye configurations differ in only one property; the differing property is still isolated to the correct eye in VR.
- The left-eye and right-eye configurations are identical; the app displays identical visuals intentionally without treating this as an error.
- The user changes configuration values immediately before entering VR; the latest values are used for the correct eyes.
- The user exits and re-enters VR after changing one eye's configuration; the new session reflects the updated per-eye assignment.
- Immersive VR is unsupported, declined, or fails to start; the app preserves the regular browser view and current configuration.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The immersive VR presentation MUST keep left-eye and right-eye visual outputs separate when the two eye configurations differ.
- **FR-002**: The immersive VR presentation MUST display the left-eye configuration only to the user's left eye.
- **FR-003**: The immersive VR presentation MUST display the right-eye configuration only to the user's right eye.
- **FR-004**: The immersive VR presentation MUST NOT blend, average, overlay, or otherwise merge left-eye and right-eye configurations into a shared visual when different per-eye configurations are selected.
- **FR-005**: The immersive VR presentation MUST apply per-eye differences for all currently supported configurable stimulus properties, including shape, color, rotation, and animated state where applicable.
- **FR-006**: The app MUST continue to support intentionally identical left-eye and right-eye configurations as valid control cases.
- **FR-007**: The app MUST use the current regular browser configuration values when entering VR, including the latest changes made before the session starts.
- **FR-008**: Returning from VR MUST preserve the user's current left-eye and right-eye configuration values in the regular browser view.
- **FR-009**: Unsupported, declined, or failed VR entry MUST leave the regular browser configuration view usable and must not alter the selected per-eye values.
- **FR-010**: The regular browser view MUST remain available for configuring and reviewing left-eye and right-eye values independently.
- **FR-011**: The fix MUST remain within the static website boundary and MUST NOT require accounts, server-side state, a database, or private remote services.

### Key Entities *(include if feature involves data)*

- **Experiment Configuration**: The complete selected setup for one trial, containing separate left-eye and right-eye stimulus configurations.
- **Eye Stimulus Configuration**: The selected visual properties for one eye, including eye side, shape, color, rotation, and animated or static presentation.
- **Immersive Presentation**: The active VR experience in which the current experiment configuration is shown to the user.
- **Regular Browser Configuration View**: The non-VR interface where users review and change the separate eye configurations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation trials with intentionally different left-eye and right-eye configurations, reviewers can correctly identify which stimulus appeared to each eye in at least 95% of completed trials.
- **SC-002**: In all tested VR sessions using different per-eye colors, shapes, or rotations, no reviewer observes a merged, blended, or shared stimulus where separate per-eye stimuli were expected.
- **SC-003**: A user can change one eye's configuration and enter VR with the updated per-eye result visible in under 30 seconds.
- **SC-004**: In 100% of tested unsupported, declined, or failed VR entry attempts, the regular browser view remains usable and preserves both eye configurations.
- **SC-005**: In control trials where both eyes are configured identically, both eyes display matching stimuli in 100% of tested VR sessions.

## Assumptions

- The existing app already provides separate left-eye and right-eye configuration controls in the regular browser view.
- The defect is limited to immersive VR presentation and does not require changing the user-facing configuration model.
- Supported configurable stimulus properties remain the existing set from the current app: shape, color, rotation, and animated or static presentation when available.
- Manual reviewer validation on a compatible VR device is acceptable for confirming per-eye presentation because the primary outcome is visual and perceptual.
- The app remains a static website suitable for GitHub Pages, and WebXR remains an enhancement over the regular browser view.
