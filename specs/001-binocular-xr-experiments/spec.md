# Feature Specification: Binocular XR Experiments

**Feature Branch**: `001-binocular-xr-experiments`

**Created**: 2026-08-18

**Status**: Draft

**Input**: User description: "Create a static website for experiments with binocular discrepancy. The main technical challenge of this app is present different images to each eye in the WebXR mode.

The initial screen is for configuration and is rendered in the regular browser view. It shows two columns: each column is for one eye. User should be able to configure what is displayed for each eye. Start with some regular 2D and 3D shapes, allow setting color and rotation independently for each eye. Add "Enter VR" button that will turn on the WebXR mode.

In the WebXR mode the animation (or static images) should be presented according to configuration. The experience should be fully immersive."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Per-Eye Stimuli (Priority: P1)

As an experimenter, I want to configure separate visual stimuli for the left and right eye before
entering the immersive experience, so that I can prepare a binocular discrepancy experiment from a
regular browser view.

**Why this priority**: Configuration is the required starting point for every experiment and delivers
value even before immersive presentation is available.

**Independent Test**: Can be fully tested by opening the website, changing each eye's selected shape,
color, and rotation independently, and confirming that the configuration summary or preview reflects
different values for each eye.

**Acceptance Scenarios**:

1. **Given** the website is opened in a regular browser view, **When** the initial screen loads,
   **Then** the user sees two side-by-side configuration columns labeled for the left and right eye.
2. **Given** both eye columns are visible, **When** the user selects a different shape, color, or
   rotation for one eye, **Then** the other eye's configuration remains unchanged.
3. **Given** the user has configured both eyes, **When** the configuration is reviewed before entering
   VR, **Then** the selected shape, color, and rotation for each eye are distinguishable.

---

### User Story 2 - Enter Immersive Per-Eye Presentation (Priority: P2)

As an experimenter with a compatible immersive device, I want to enter VR from the configuration
screen, so that each eye is presented with the visual stimulus configured for that eye.

**Why this priority**: The main purpose of the app is binocular discrepancy presentation in an
immersive mode.

**Independent Test**: Can be tested by configuring intentionally different left-eye and right-eye
stimuli, selecting Enter VR, and verifying that the immersive experience presents the corresponding
stimulus to each eye.

**Acceptance Scenarios**:

1. **Given** the user has configured stimuli for both eyes on a compatible device, **When** the user
   selects Enter VR and grants any required browser permission, **Then** the immersive experience
   starts and presents the configured left-eye stimulus to the left eye and right-eye stimulus to the
   right eye.
2. **Given** the left and right eye configurations differ in color or rotation, **When** the user is
   in the immersive experience, **Then** the displayed stimuli preserve those per-eye differences.
3. **Given** the configured stimulus is animated, **When** the user enters the immersive experience,
   **Then** the animation is visible according to the selected configuration without requiring
   additional setup.

---

### User Story 3 - Recover When Immersive Mode Is Unavailable (Priority: P3)

As an experimenter on an unsupported browser or device, I want a clear fallback instead of a broken
experience, so that I can still prepare or adjust experiment configurations in the regular browser
view.

**Why this priority**: Immersive support varies by device, but the static website must remain usable
and understandable without it.

**Independent Test**: Can be tested by opening the website in a browser or environment where
immersive mode is unavailable, selecting Enter VR, and confirming the user remains in the regular
browser view with the current configuration preserved.

**Acceptance Scenarios**:

1. **Given** immersive mode is unsupported or unavailable, **When** the user views the configuration
   screen, **Then** the page still allows the user to configure left-eye and right-eye stimuli.
2. **Given** immersive mode fails to start or permission is declined, **When** the attempted session
   ends, **Then** the user remains on the configuration screen and their selected values are retained.

### Edge Cases

- The user attempts to enter VR before changing any settings; the app uses a complete default
  configuration for both eyes.
- The user selects identical values for both eyes; the app still treats the left and right eye
  configurations as separate and valid.
- The user selects extreme rotations; the app keeps the values within the supported range and shows
  the resulting orientation consistently in browser and immersive views.
- The user's device or browser does not support immersive presentation; the configuration view
  remains usable and the failure is communicated without losing selections.
- The immersive session ends unexpectedly; the user returns to the configuration view with the last
  selected values available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The website MUST provide an initial regular browser view dedicated to configuring a
  binocular discrepancy experiment.
- **FR-002**: The configuration view MUST show two distinct columns, one for the left eye and one for
  the right eye.
- **FR-003**: Users MUST be able to choose from an initial set of regular 2D and 3D shapes for each
  eye independently.
- **FR-004**: Users MUST be able to set the display color for each eye independently.
- **FR-005**: Users MUST be able to set the rotation for each eye independently.
- **FR-006**: The app MUST preserve separate left-eye and right-eye configuration values when any
  single setting is changed.
- **FR-007**: The configuration view MUST provide an Enter VR action that starts immersive
  presentation only after explicit user selection.
- **FR-008**: The immersive presentation MUST display visual content according to the current
  left-eye and right-eye configurations.
- **FR-009**: The immersive presentation MUST support binocular discrepancy by allowing the left eye
  and right eye to receive different configured visuals during the same immersive experience.
- **FR-010**: The immersive presentation MUST support both static stimuli and animated stimuli when
  the selected stimulus includes animation.
- **FR-011**: The experience MUST be fully immersive once VR has started, with the experiment content
  presented as the user's primary visual environment.
- **FR-012**: The app MUST handle unsupported immersive capability, declined permission, or failed
  session start by keeping the user in the regular browser view with their configuration retained.
- **FR-013**: The app MUST operate as a static website without requiring accounts, server-side state,
  a database, or private remote services.
- **FR-014**: The app MUST remain usable in the regular browser view even when immersive mode is not
  available.

### Key Entities *(include if feature involves data)*

- **Experiment Configuration**: The complete set of selected values for a binocular discrepancy
  session, including one left-eye stimulus configuration and one right-eye stimulus configuration.
- **Eye Stimulus Configuration**: The settings for one eye, including eye side, selected shape,
  selected color, rotation, and whether the stimulus is static or animated.
- **Stimulus Shape**: A selectable visual form available for display, initially including regular 2D
  shapes and regular 3D shapes.
- **Immersive Session State**: The user's transition state between regular browser configuration,
  immersive presentation, failed immersive entry, and return from immersive mode.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can configure different left-eye and right-eye shapes, colors, and
  rotations in under 2 minutes.
- **SC-002**: In user testing on a compatible immersive device, at least 90% of participants can
  enter the immersive experience from the configuration screen without assistance.
- **SC-003**: In validation trials with intentionally different per-eye configurations, reviewers can
  correctly identify the configured per-eye difference in at least 95% of trials.
- **SC-004**: When immersive mode is unavailable or fails to start, 100% of tested attempts preserve
  the user's current configuration and leave the regular browser view usable.
- **SC-005**: The default configuration allows a user to enter an immersive presentation without
  changing any settings.
- **SC-006**: The regular browser view and immersive presentation reflect the same selected
  configuration for shape, color, and rotation in all tested default and modified configurations.

## Assumptions

- The primary user is an experimenter or researcher preparing visual discrepancy stimuli for manual
  inspection or demonstration.
- The first version includes a curated starter set of common regular 2D and 3D shapes rather than
  custom image uploads or arbitrary model import.
- Rotation controls use bounded values that are understandable to non-technical users.
- Configuration persistence beyond the current browser session is optional unless a later feature
  specification requires saved experiments.
- The website is published as static files suitable for GitHub Pages and does not require a database,
  account system, or private backend service.
- Immersive mode is an enhancement; all configuration work remains available in the regular browser
  view.
