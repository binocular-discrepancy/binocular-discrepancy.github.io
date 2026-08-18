# Data Model: Binocular XR Experiments

## Experiment Configuration

Represents the active setup for one binocular discrepancy session.

**Fields**:

- `leftEye`: Eye Stimulus Configuration for the left eye
- `rightEye`: Eye Stimulus Configuration for the right eye
- `presentationMode`: `static` or `animated`
- `updatedAt`: timestamp or monotonic revision used to refresh previews

**Relationships**:

- Contains exactly two Eye Stimulus Configurations.
- References Stimulus Shape records through each eye configuration.

**Validation Rules**:

- Both `leftEye` and `rightEye` must always exist.
- Defaults must produce a complete, presentable configuration.
- Changing one eye's values must not mutate the other eye.

## Eye Stimulus Configuration

Represents settings for one eye's visual stimulus.

**Fields**:

- `eye`: `left` or `right`
- `shapeId`: selected Stimulus Shape identifier
- `color`: selected display color
- `rotationX`: bounded rotation value
- `rotationY`: bounded rotation value
- `rotationZ`: bounded rotation value

**Relationships**:

- Belongs to one Experiment Configuration.
- References one Stimulus Shape.

**Validation Rules**:

- `eye` must match the containing side.
- `shapeId` must reference an available starter shape.
- `color` must be a valid selectable color value.
- Rotation values must stay inside the supported control range.

## Stimulus Shape

Represents a selectable visual form available in the starter catalog.

**Fields**:

- `id`: stable shape identifier
- `label`: user-facing shape name
- `dimension`: `2D` or `3D`
- `supportsAnimation`: whether the shape can participate in the animated presentation mode

**Relationships**:

- Referenced by Eye Stimulus Configuration.

**Validation Rules**:

- Shape identifiers must be unique.
- Starter catalog must include at least two 2D shapes and at least two 3D shapes.
- Every shape must be renderable in both regular preview and immersive presentation contexts.

## Immersive Session State

Represents the state of entering, presenting, failing, or exiting immersive mode.

**Fields**:

- `status`: `regular-view`, `checking-support`, `entering-vr`, `presenting-vr`, `failed`, or
  `ended`
- `isSupported`: whether immersive VR support is currently known
- `message`: user-facing status or failure message
- `lastConfigurationRevision`: configuration revision used when the session started

**State Transitions**:

- `regular-view` -> `checking-support` when the page checks immersive availability.
- `regular-view` -> `entering-vr` when the user selects Enter VR.
- `entering-vr` -> `presenting-vr` when immersive entry succeeds.
- `entering-vr` -> `failed` when support, permission, or session startup fails.
- `presenting-vr` -> `ended` when the immersive session exits.
- `failed` or `ended` -> `regular-view` when the user returns to configuration.

**Validation Rules**:

- Failed or ended sessions must preserve the current Experiment Configuration.
- Entering VR must only be initiated from explicit user action.
- Regular view must remain usable regardless of immersive support status.
