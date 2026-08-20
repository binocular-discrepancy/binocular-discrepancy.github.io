# UI Contract: VR Eye Isolation

## Contract Scope

This contract defines observable behavior for the static web app's regular browser view, diagnostic setup, and immersive VR mode. It is not a network API.

## Diagnostic Setup

**Preconditions**:

- The regular browser view is loaded.
- The user can configure or activate a diagnostic left/right pair.

**Action**:

- The user prepares a diagnostic pair with unmistakable left-only and right-only markers.

**Expected Outcome**:

- The regular browser view clearly represents the left diagnostic marker as left-only.
- The regular browser view clearly represents the right diagnostic marker as right-only.
- The setup can be entered into VR without requiring server-side state or account state.

## Enter VR With Diagnostic Pair

**Preconditions**:

- A compatible VR headset/browser is available.
- The diagnostic pair is active.

**Action**:

- The user enters VR and checks each physical eye independently.

**Expected Outcome**:

- The left physical eye sees the left-only marker and does not see the right-only marker.
- The right physical eye sees the right-only marker and does not see the left-only marker.
- Neither physical eye sees both markers at once.
- A result is recorded with device, browser, Three.js version, left-eye observation, right-eye observation, merged-image observation, and pass/fail outcome.

## Merged Rendering Failure

**Preconditions**:

- The diagnostic pair is active.
- Both physical eyes receive the same combined image.

**Action**:

- The user checks each eye independently.

**Expected Outcome**:

- The validation result is marked fail.
- The result states that a merged or duplicated image appeared in one or both eyes.

## Unsupported Or Failed VR

**Preconditions**:

- Immersive VR is unsupported, unavailable, declined, or fails to start.

**Action**:

- The user attempts or is unable to enter VR.

**Expected Outcome**:

- The app remains in the regular browser view.
- Current left/right configuration values are preserved.
- The user sees an in-page status message.
