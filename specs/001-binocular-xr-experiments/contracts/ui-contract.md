# UI Contract: Binocular XR Experiments

## Configuration Screen

The initial page view exposes the experiment configuration contract.

**Required regions**:

- Left eye configuration column
- Right eye configuration column
- Per-eye preview or clear configuration summary
- Enter VR action
- Immersive support or failure status message

**Per-eye controls**:

- Shape selector with regular 2D and 3D starter shapes
- Color selector
- Rotation controls for the supported axes

**Behavior contract**:

- Updating a control in one eye column updates only that eye's stimulus configuration.
- The page always holds a complete default configuration.
- The Enter VR action uses the current configuration at the moment of selection.
- If immersive mode is unavailable or fails, the user remains in regular browser view and the
  configuration remains intact.

## Immersive Presentation

The immersive view exposes the configured experiment presentation contract.

**Required presentation behavior**:

- The left-eye view receives the left-eye stimulus configuration.
- The right-eye view receives the right-eye stimulus configuration.
- Shape, color, and rotation differences between eyes remain visible during presentation.
- Static stimuli remain stable unless the selected presentation mode is animated.
- Animated stimuli animate consistently according to the active configuration.
- The presentation fills the immersive environment as the primary visual experience.

**Session behavior**:

- Immersive entry starts only from the Enter VR action.
- Session failure returns to the configuration screen with a clear message.
- Session exit returns to the configuration screen with the current configuration retained.

## Static Deployment Contract

The deliverable must be deployable as static files.

**Required files**:

- `index.html`
- `styles.css`
- JavaScript modules under `src/`

**External dependency contract**:

- External JavaScript dependencies must use explicit CDN URLs.
- CDN imports must be pinned to concrete versions.
- No private credentials, database connections, or server-only routes may be required.
