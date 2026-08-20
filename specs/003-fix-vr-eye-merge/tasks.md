# Tasks: Fix VR Eye Merge

**Input**: Design documents from `/specs/003-fix-vr-eye-merge/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/vr-eye-isolation.md`, `quickstart.md`

**Tests**: No automated TDD mandate. This feature requires local browser smoke validation plus real WebXR headset validation because the failure only appears in immersive VR.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other independent file work
- **[Story]**: User story label for story-phase tasks only
- Include exact file paths in each task description

## Phase 1: Setup

**Purpose**: Establish the current runtime entry points and WebXR layer behavior before editing.

- [X] T001 Review the Three.js import map and app entry script URL in `index.html`
- [X] T002 [P] Review local module cache-busting imports in `src/app.js`
- [X] T003 [P] Review local module cache-busting imports in `src/preview.js`
- [X] T004 [P] Review local module cache-busting imports in `src/xr-session.js`
- [X] T005 [P] Review current per-eye layer constants, camera layer setup, and stimulus creation in `src/xr-session.js`
- [X] T006 [P] Review available stimulus shapes, colors, rotations, and motion options in `src/config.js`
- [X] T007 [P] Review stimulus mesh construction and shared-scene layer handling in `src/stimuli.js`

## Phase 2: Foundation

**Purpose**: Fix the known-bad WebXR dependency and make script cache invalidation consistent.

- [X] T008 Update the Three.js import map from `three@0.170.0` to a pinned fixed release, `three@0.185.0`, in `index.html`
- [X] T009 Update the local app script version query in `index.html` to a new version value
- [X] T010 Update all local module import version queries in `src/app.js` to the same version value used by `index.html`
- [X] T011 Update all local module import version queries in `src/preview.js` to the same version value used by `index.html`
- [X] T012 Update all local module import version queries in `src/xr-session.js` to the same version value used by `index.html`
- [X] T013 Confirm no runtime reference to `three@0.170.0` remains in `index.html`
- [X] T014 Confirm the app still uses only static assets and CDN-loaded external JavaScript in `index.html`

## Phase 3: User Story 1 - Prove Each Eye Receives Only Its Own Stimulus (Priority: P1)

**Goal**: A diagnostic VR setup proves that the left physical eye sees only the left stimulus and the right physical eye sees only the right stimulus.

**Independent Test**: Load the diagnostic pair, enter VR on a headset, cover/check each physical eye separately, and verify neither eye sees the other eye's marker or a merged image.

- [X] T015 [US1] Add an unmistakable diagnostic stimulus preset with distinct left/right shape, color, rotation, and motion values in `src/config.js`
- [X] T016 [US1] Add a diagnostic preset application path that updates both eye configurations without coupling later independent edits in `src/config.js`
- [X] T017 [P] [US1] Ensure diagnostic markers render with visually distinct geometry/material output through existing stimulus construction in `src/stimuli.js`
- [X] T018 [US1] Add a diagnostic control that applies the diagnostic pair from the regular browser UI in `index.html`
- [X] T019 [US1] Wire the diagnostic control to config updates, preview refresh, and summary refresh in `src/app.js`
- [X] T020 [US1] Ensure `src/xr-session.js` creates separate left-eye and right-eye stimulus objects from the latest configuration at VR entry
- [X] T021 [US1] Ensure `src/xr-session.js` assigns left stimulus content only to layer 1 and right stimulus content only to layer 2
- [X] T022 [US1] Ensure `src/xr-session.js` enables only shared, left-eye, and right-eye layers on the base XR camera and does not re-enable opposite-eye layers per frame
- [X] T023 [US1] Create `specs/003-fix-vr-eye-merge/validation-results.md` from the validation record template in `specs/003-fix-vr-eye-merge/quickstart.md`
- [ ] T024 [US1] Run Scenario 3 from `specs/003-fix-vr-eye-merge/quickstart.md` on a WebXR headset and record the result in `specs/003-fix-vr-eye-merge/validation-results.md`

## Phase 4: User Story 2 - Detect And Reject False Fixes (Priority: P2)

**Goal**: Validation clearly fails if either eye sees a duplicated, combined, averaged, or merged image.

**Independent Test**: During diagnostic VR validation, mark the result failed if either physical eye sees both diagnostic markers or the same combined image appears in both eyes.

- [X] T025 [US2] Add in-page diagnostic status text that identifies the active diagnostic pair and expected left/right observations in `src/app.js`
- [X] T026 [US2] Include the active Three.js version and diagnostic state in VR status/debug output in `src/xr-session.js`
- [X] T027 [US2] Update the validation instructions to treat any same-image, merged-image, or both-markers observation as failure in `specs/003-fix-vr-eye-merge/quickstart.md`
- [X] T028 [US2] Add explicit pass/fail fields for same-image, merged-image, and opposite-eye leakage observations in `specs/003-fix-vr-eye-merge/validation-results.md`
- [ ] T029 [US2] Run the diagnostic validation again after recording fields from T028 and update `specs/003-fix-vr-eye-merge/validation-results.md`

## Phase 5: User Story 3 - Preserve Non-VR Configuration And Fallback (Priority: P3)

**Goal**: The regular browser view and unsupported/failing VR paths continue to work independently after the WebXR fix.

**Independent Test**: Change left/right settings in the browser view, verify previews and summaries remain independent, then attempt VR in an unsupported or denied context and verify the configuration is preserved.

- [X] T030 [US3] Confirm diagnostic preset application does not remove independent left/right browser controls in `index.html`
- [X] T031 [US3] Confirm regular preview rendering still reads left and right configurations independently in `src/preview.js`
- [X] T032 [US3] Confirm VR session failure and exit cleanup preserve the current left/right configuration in `src/xr-session.js`
- [ ] T033 [US3] Run Scenario 2 from `specs/003-fix-vr-eye-merge/quickstart.md` and record browser-view observations in `specs/003-fix-vr-eye-merge/validation-results.md`
- [X] T034 [US3] Run Scenario 5 from `specs/003-fix-vr-eye-merge/quickstart.md` and record fallback observations in `specs/003-fix-vr-eye-merge/validation-results.md`

## Phase 6: Polish And Cross-Cutting Validation

**Purpose**: Verify static deployment compatibility, syntax, dependency state, and final acceptance criteria.

- [X] T035 [P] Run JavaScript syntax checks for `src/app.js`
- [X] T036 [P] Run JavaScript syntax checks for `src/config.js`
- [X] T037 [P] Run JavaScript syntax checks for `src/preview.js`
- [X] T038 [P] Run JavaScript syntax checks for `src/stimuli.js`
- [X] T039 [P] Run JavaScript syntax checks for `src/xr-session.js`
- [X] T040 Start a local static server from the repository root and verify `index.html` loads without module errors
- [X] T041 Verify `index.html` and local module imports use the same app version query value
- [X] T042 Verify `specs/003-fix-vr-eye-merge/validation-results.md` records device, browser, Three.js version, left-eye observation, right-eye observation, merged-image observation, and final pass/fail result
- [ ] T043 Confirm Feature Requirements FR-001 through FR-011 from `specs/003-fix-vr-eye-merge/spec.md` against the implementation and validation evidence
- [X] T044 Confirm the final implementation remains GitHub Pages compatible according to `.specify/memory/constitution.md`

## Dependencies

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before any VR headset validation in Phase 3.
- User Story 1 is the MVP and must complete before User Story 2 can reject false fixes.
- User Story 3 can start after Phase 2, but its final validation should run after User Story 1 changes are complete.
- Phase 6 runs after the selected user stories are implemented.

## Parallel Examples

```text
# Setup review tasks
T002, T003, T004, T005, T006, and T007 can run in parallel.

# User Story 1 independent file work
T017 can run after T015 while T018 is being implemented.

# Polish syntax checks
T035, T036, T037, T038, and T039 can run in parallel.
```

## Implementation Strategy

### MVP First

Complete Phases 1 and 2, then complete User Story 1. Stop to validate in a real headset before treating the feature as fixed.

### Incremental Delivery

1. Fix the Three.js dependency and cache-busting foundation.
2. Add diagnostic pair support and prove per-eye isolation in VR.
3. Add false-fix detection fields and repeat validation.
4. Confirm regular browser and fallback behavior.

### Fallback Decision

If headset validation still shows merged images after the Three.js upgrade and layer isolation checks, record the failed evidence in `specs/003-fix-vr-eye-merge/validation-results.md` before planning a raw WebXR or custom shader fallback.
