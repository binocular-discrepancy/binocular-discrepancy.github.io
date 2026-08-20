# Tasks: Fix VR Eye Images

**Input**: Design documents from `/specs/002-fix-vr-eye-images/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/vr-eye-presentation.md](./contracts/vr-eye-presentation.md), [quickstart.md](./quickstart.md)

**Tests**: No TDD or automated tests were explicitly requested. Tasks include manual regular-browser and headset validation from `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or is a validation activity after prerequisites
- **[Story]**: Maps to user stories from `spec.md`
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current static app and dependency baseline before changing immersive rendering.

- [X] T001 Inspect the existing Three.js import map and confirm pinned CDN dependency remains `three@0.170.0` in `index.html`
- [X] T002 [P] Review current eye configuration shape, color, rotation, and presentation state fields in `src/config.js`
- [X] T003 [P] Review current stimulus mesh creation, material creation, and layer-sensitive shared environment helpers in `src/stimuli.js`
- [X] T004 [P] Review current WebXR session lifecycle, renderer creation, camera setup, and cleanup behavior in `src/xr-session.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared rendering invariants that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define named constants for the default shared layer, left-eye layer, and right-eye layer in `src/xr-session.js`
- [X] T006 Ensure common environment content remains on the shared default layer and is not assigned to either eye-only layer in `src/stimuli.js`
- [X] T007 Add or refine helper logic that assigns one stimulus mesh to exactly one eye-only layer in `src/xr-session.js`
- [X] T008 Add a development-only XR camera inspection helper that can report sub-camera count and layer masks during an active session in `src/xr-session.js`
- [X] T009 Verify the app still starts from a static local server with no build step by running the command documented in `specs/002-fix-vr-eye-images/quickstart.md`

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Verify Separate VR Eye Presentation (Priority: P1) MVP

**Goal**: The immersive VR view shows the left-eye configuration only to the left eye and the right-eye configuration only to the right eye.

**Independent Test**: Configure clearly different left-eye and right-eye stimuli, enter VR, and verify each eye receives only its own configured visual without blending, averaging, or merging.

### Implementation for User Story 1

- [X] T010 [US1] Update immersive scene construction so `leftStimulus` is created only from `configuration.leftEye` and `rightStimulus` only from `configuration.rightEye` in `src/xr-session.js`
- [X] T011 [US1] Assign `leftStimulus` exclusively to the left-eye layer and `rightStimulus` exclusively to the right-eye layer in `src/xr-session.js`
- [X] T012 [US1] Remove per-frame sub-camera layer mutation that conflicts with or duplicates Three.js WebXRManager layer handling in `src/xr-session.js`
- [X] T013 [US1] Ensure the base XR camera enables the shared layer plus both eye-only layers so Three.js can derive correct sub-camera masks in `src/xr-session.js`
- [X] T014 [US1] Confirm animated mode preserves separate left-eye and right-eye meshes without swapping, combining, or reusing one mesh for both eyes in `src/xr-session.js`
- [ ] T015 [US1] Validate different-color VR behavior using Scenario 2 from `specs/002-fix-vr-eye-images/quickstart.md`
- [ ] T016 [US1] Validate different-shape and different-rotation VR behavior using Scenario 3 from `specs/002-fix-vr-eye-images/quickstart.md`
- [ ] T017 [US1] Record headset/browser validation observations against the "Enter VR With Different Per-Eye Configuration" contract in `specs/002-fix-vr-eye-images/contracts/vr-eye-presentation.md`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Preserve Same-Image Cases (Priority: P2)

**Goal**: Intentionally identical left-eye and right-eye configurations still display matching stimuli while preserving separate eye assignments.

**Independent Test**: Configure both eyes identically, enter VR, verify matching stimuli, then change one eye and verify only that eye changes in the next session.

### Implementation for User Story 2

- [X] T018 [US2] Ensure identical left-eye and right-eye configurations still create two independent stimulus meshes rather than reusing one shared mesh in `src/xr-session.js`
- [X] T019 [US2] Ensure cleanup disposes both independent stimulus meshes after each VR session, including identical-control cases, in `src/xr-session.js`
- [X] T020 [US2] Verify changing one eye after an identical-control session updates only that eye's configuration snapshot before re-entering VR in `src/config.js`
- [ ] T021 [US2] Validate identical-control and one-eye-change behavior using Scenario 4 from `specs/002-fix-vr-eye-images/quickstart.md`
- [ ] T022 [US2] Record validation observations against the "Enter VR With Identical Per-Eye Configuration" and "Change One Eye And Re-Enter VR" contracts in `specs/002-fix-vr-eye-images/contracts/vr-eye-presentation.md`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Maintain Browser View Fallback (Priority: P3)

**Goal**: Unsupported, declined, failed, or ended VR sessions preserve the regular browser configuration view and current per-eye values.

**Independent Test**: Attempt immersive entry in an unsupported or unavailable environment and verify the regular browser view remains usable with both configurations preserved.

### Implementation for User Story 3

- [X] T023 [US3] Confirm WebXR support detection keeps the Enter VR action disabled and shows an in-page status message when immersive VR is unavailable in `src/xr-session.js`
- [X] T024 [US3] Ensure failed `navigator.xr.requestSession("immersive-vr")` attempts do not mutate configuration state or preview state in `src/xr-session.js`
- [X] T025 [US3] Ensure normal session end restores focus, hides the XR canvas, and preserves the regular browser view in `src/xr-session.js`
- [X] T026 [US3] Validate regular browser independence using Scenario 1 from `specs/002-fix-vr-eye-images/quickstart.md`
- [X] T027 [US3] Validate unsupported or failed VR behavior using Scenario 5 from `specs/002-fix-vr-eye-images/quickstart.md`
- [X] T028 [US3] Record validation observations against the "Unsupported Or Failed VR Entry" contract in `specs/002-fix-vr-eye-images/contracts/vr-eye-presentation.md`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks and documentation alignment across stories.

- [X] T029 [P] Remove temporary development-only XR camera inspection output unless it is hidden behind an intentional debug flag in `src/xr-session.js`
- [X] T030 [P] Review comments and naming for per-eye layer constants and helpers for clarity in `src/xr-session.js`
- [X] T031 [P] Review shared stimulus helper naming and disposal behavior for clarity in `src/stimuli.js`
- [ ] T032 Run all quickstart validation scenarios from `specs/002-fix-vr-eye-images/quickstart.md`
- [ ] T033 Confirm final behavior satisfies all functional requirements FR-001 through FR-011 in `specs/002-fix-vr-eye-images/spec.md`
- [X] T034 Confirm final implementation still satisfies static deployment, self-contained runtime, CDN dependency, dual view parity, and progressive WebXR requirements in `.specify/memory/constitution.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and should be validated after US1 because it reuses the same per-eye isolation path.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and can be implemented alongside US1 or US2 if file coordination is managed.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories after Foundation. Delivers MVP.
- **US2 (P2)**: Uses the same independent mesh and layer behavior as US1; validate after US1.
- **US3 (P3)**: Independent fallback behavior after Foundation; can be worked in parallel with US1/US2 with care because it touches `src/xr-session.js`.

### Within Each User Story

- Implementation tasks come before headset validation tasks.
- Contract observation tasks come after scenario validation.
- A story is complete only when its checkpoint behavior is demonstrated independently.

---

## Parallel Opportunities

- Setup review tasks T002, T003, and T004 can run in parallel.
- Foundational task T006 can run in parallel with T005 once current layer behavior is understood; T007 and T008 depend on T005.
- US1 validation tasks T015 and T016 can run after T010-T014 and may be performed in either order.
- US2 validation and contract observation tasks T021 and T022 run after T018-T020.
- US3 regular-view validation T026 and failed-VR validation T027 can run after T023-T025.
- Polish review tasks T029, T030, and T031 can run in parallel.

---

## Parallel Example: User Story 1

```text
Task: "Validate different-color VR behavior using Scenario 2 from specs/002-fix-vr-eye-images/quickstart.md"
Task: "Validate different-shape and different-rotation VR behavior using Scenario 3 from specs/002-fix-vr-eye-images/quickstart.md"
```

## Parallel Example: User Story 3

```text
Task: "Validate regular browser independence using Scenario 1 from specs/002-fix-vr-eye-images/quickstart.md"
Task: "Validate unsupported or failed VR behavior using Scenario 5 from specs/002-fix-vr-eye-images/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup review.
2. Complete Phase 2 foundational layer and debug invariants.
3. Complete Phase 3 User Story 1.
4. Stop and validate discrepant per-eye VR rendering on a compatible headset.

### Incremental Delivery

1. Deliver US1 to fix the reported merged-image defect.
2. Add US2 to protect intentionally identical control trials.
3. Add US3 to confirm fallback and session failure behavior remains intact.
4. Run final quickstart and constitution validation.

### Notes

- `[P]` marks tasks that can be performed in parallel when file conflicts are avoided.
- All implementation tasks include exact repository paths.
- Headset validation is required for final confidence because the defect is specific to immersive VR presentation.
