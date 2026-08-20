# Data Model: Fix VR Eye Merge

## Experiment Configuration

Current browser-side selections used when entering VR.

**Fields**:

- `leftEye`: Eye Stimulus Assignment source values for the left eye
- `rightEye`: Eye Stimulus Assignment source values for the right eye
- `presentationMode`: static or animated
- `updatedAt`: browser-local change marker

**Relationships**:

- Supplies values to regular browser previews.
- Supplies a snapshot to immersive VR entry.
- Can be transformed into a Diagnostic Stimulus Pair for validation.

**Validation Rules**:

- Left and right eye values must remain independently editable.
- The latest values must be used when entering VR.
- Exiting or failing VR must not mutate the configuration.

## Eye Stimulus Assignment

Mapping from one configured eye side to the visual content shown only to that physical eye.

**Fields**:

- `eye`: left or right
- `shapeId`: selected shape
- `color`: selected color
- `rotationX`: bounded rotation value
- `rotationY`: bounded rotation value
- `rotationZ`: bounded rotation value
- `motion`: static or animated behavior inherited from the presentation mode
- `eyeLayer`: internal eye-only assignment used by VR rendering

**Relationships**:

- Belongs to one Experiment Configuration.
- Produces one independent VR stimulus.

**Validation Rules**:

- Left assignments must never be visible in the right physical eye when left/right content differs.
- Right assignments must never be visible in the left physical eye when left/right content differs.
- Identical controls still create separate assignments.

## Diagnostic Stimulus Pair

Deliberately contrasting pair used to reveal merged rendering.

**Fields**:

- `leftMarker`: left-only visual marker
- `rightMarker`: right-only visual marker
- `leftColor`: high-contrast left-only color
- `rightColor`: high-contrast right-only color
- `instructions`: reviewer steps for checking one eye at a time

**Relationships**:

- Derived from or applied to Experiment Configuration.
- Produces one VR Validation Result.

**Validation Rules**:

- Markers must be distinguishable when seen by one eye at a time.
- A merged image must be visually obvious and recorded as a failure.

## VR Validation Result

Recorded headset validation outcome.

**Fields**:

- `device`: headset/browser used
- `threeVersion`: pinned Three.js version used
- `leftEyeObserved`: content observed by the left eye
- `rightEyeObserved`: content observed by the right eye
- `mergedImageObserved`: yes or no
- `result`: pass or fail
- `notes`: optional reviewer notes

**Relationships**:

- Evaluates one Diagnostic Stimulus Pair on one headset/browser combination.

**Validation Rules**:

- Pass requires no opposite-eye marker in either eye.
- Pass requires no merged image in either eye.
- Fail must identify which merged or duplicated content appeared.

## State Transitions

```text
Regular browser view
  -> apply diagnostic configuration
  -> requesting immersive VR
  -> active immersive VR
  -> validation result recorded
  -> regular browser view

Regular browser view
  -> requesting immersive VR
  -> failed immersive entry
  -> regular browser view
```

The regular browser configuration remains available across all transitions.
