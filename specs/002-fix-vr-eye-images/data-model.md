# Data Model: Fix VR Eye Images

## Experiment Configuration

Represents the complete selected setup used when entering an immersive presentation.

**Fields**:

- `leftEye`: Eye Stimulus Configuration for the left eye
- `rightEye`: Eye Stimulus Configuration for the right eye
- `presentationMode`: static or animated
- `updatedAt`: monotonically increasing browser-local change marker

**Relationships**:

- Contains exactly one left-eye configuration and exactly one right-eye configuration.
- Supplies values to both the regular browser previews and the immersive presentation.

**Validation Rules**:

- `leftEye.eye` must identify the left eye.
- `rightEye.eye` must identify the right eye.
- `presentationMode` must be one of the supported presentation modes.
- The latest configuration at the time of Enter VR is the configuration used for the session.

## Eye Stimulus Configuration

Represents the selected visual properties for one eye.

**Fields**:

- `eye`: left or right
- `shapeId`: selected supported shape
- `color`: selected display color
- `rotationX`: bounded rotation value
- `rotationY`: bounded rotation value
- `rotationZ`: bounded rotation value

**Relationships**:

- Belongs to one Experiment Configuration.
- Maps to one stimulus mesh in immersive VR.
- Maps to one preview stimulus in the regular browser view.

**Validation Rules**:

- Eye side must remain stable when fields change.
- Rotation values must remain within the supported range.
- Shape identifiers must resolve to supported shapes.
- Color values must remain valid display colors.

## Immersive Presentation

Represents the active VR session after the user selects Enter VR.

**Fields**:

- `sessionState`: requesting, active, ended, failed
- `leftStimulus`: stimulus generated from the left-eye configuration
- `rightStimulus`: stimulus generated from the right-eye configuration
- `commonEnvironment`: shared background, floor, and lighting visible to both eyes

**Relationships**:

- Uses one Experiment Configuration snapshot from the time VR entry begins.
- Contains two eye-specific stimuli and shared environment content.

**Validation Rules**:

- Left-eye stimulus must be visible only to the left eye in VR.
- Right-eye stimulus must be visible only to the right eye in VR.
- Common environment may be visible to both eyes.
- Session end or failure must not mutate the regular browser configuration.

## Regular Browser Configuration View

Represents the non-VR interface where users set up and review each eye.

**Fields**:

- `leftControls`: controls bound to left-eye configuration fields
- `rightControls`: controls bound to right-eye configuration fields
- `leftPreview`: regular browser preview for left-eye stimulus
- `rightPreview`: regular browser preview for right-eye stimulus
- `sessionStatus`: current WebXR availability or session state message

**Relationships**:

- Reads and updates the active Experiment Configuration.
- Starts Immersive Presentation only after explicit user action.

**Validation Rules**:

- Changing one eye must not alter the other eye.
- Unsupported or failed VR entry must keep the view usable.
- Returning from VR must preserve the current configuration values.

## State Transitions

```text
Regular browser view
  -> requesting immersive VR
  -> active immersive VR
  -> regular browser view

Regular browser view
  -> requesting immersive VR
  -> failed immersive entry
  -> regular browser view
```

The configuration values remain available across all transitions.
