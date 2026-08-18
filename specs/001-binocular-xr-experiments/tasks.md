# Tasks: Binocular XR Experiments

**Input**: Design documents from `/specs/001-binocular-xr-experiments/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md,
quickstart.md

**Tests**: Automated test tasks are not included because neither the feature specification nor the
user request asked for TDD or automated tests. Manual validation is included in the final phase using
quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of
each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete
  tasks in the same phase.
- **[Story]**: Maps a task to a user story phase: [US1], [US2], [US3].
- Every task includes an exact repository path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the static application shell and source module layout required by all stories.

- [X] T001 Create the GitHub Pages static HTML shell with root containers and CDN import map in index.html
- [X] T002 [P] Create the responsive base stylesheet and visual design tokens in styles.css
- [X] T003 [P] Create the application entry module stub and boot sequence in src/app.js
- [X] T004 [P] Create placeholder JavaScript module files in src/config.js, src/stimuli.js, src/preview.js, and src/xr-session.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared state, stimulus catalog, rendering helpers, and status plumbing that all
user stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [X] T005 Define Experiment Configuration defaults, update helpers, and immutable per-eye state changes in src/config.js
- [X] T006 [P] Define the starter Stimulus Shape catalog with at least two 2D and two 3D shapes in src/stimuli.js
- [X] T007 [P] Implement shared shape factory functions for browser preview and immersive scenes in src/stimuli.js
- [X] T008 Implement application state wiring, DOM element lookup, and render subscription flow in src/app.js
- [X] T009 [P] Implement shared status message helpers for immersive support, failure, and session exit in src/app.js
- [X] T010 Confirm Three.js CDN imports are pinned to one explicit version and documented inline in index.html

**Checkpoint**: Foundation ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Configure Per-Eye Stimuli (Priority: P1) MVP

**Goal**: Users can configure left-eye and right-eye shape, color, and rotation independently in the
regular browser view.

**Independent Test**: Open the website, change each eye's selected shape, color, and rotation, and
confirm the preview or summary reflects different values for each eye without cross-updating the
other eye.

### Implementation for User Story 1

- [X] T011 [US1] Build the two-column left-eye and right-eye configuration form structure in index.html
- [X] T012 [P] [US1] Style the two-column configuration layout, controls, previews, and mobile stacking behavior in styles.css
- [X] T013 [US1] Populate per-eye shape selectors, color controls, and rotation controls from configuration state in src/app.js
- [X] T014 [US1] Wire per-eye control change handlers so left-eye edits only update leftEye and right-eye edits only update rightEye in src/app.js
- [X] T015 [P] [US1] Implement regular browser preview scene setup and resize handling in src/preview.js
- [X] T016 [US1] Render per-eye preview stimuli from shape, color, and rotation configuration in src/preview.js
- [X] T017 [US1] Add a readable current-configuration summary for each eye in index.html
- [X] T018 [US1] Keep configuration summary and preview synchronized after every control update in src/app.js

**Checkpoint**: User Story 1 is fully functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Enter Immersive Per-Eye Presentation (Priority: P2)

**Goal**: Users on compatible devices can enter immersive VR and see the configured left-eye visual
in the left eye and right-eye visual in the right eye.

**Independent Test**: Configure intentionally different left-eye and right-eye colors or rotations,
select Enter VR on a compatible device, and verify each eye receives its corresponding configured
stimulus.

### Implementation for User Story 2

- [X] T019 [US2] Add the Enter VR action element and immersive-session status region to index.html
- [X] T020 [P] [US2] Style the Enter VR action, disabled state, active state, and immersive status messages in styles.css
- [X] T021 [US2] Implement immersive support detection and Enter VR button enablement in src/xr-session.js
- [X] T022 [US2] Implement user-initiated immersive VR session startup and shutdown handling in src/xr-session.js
- [X] T023 [US2] Build the immersive scene from the current Experiment Configuration at session start in src/xr-session.js
- [X] T024 [US2] Implement per-eye visual separation so left-eye and right-eye configured stimuli render to the corresponding immersive views in src/xr-session.js
- [X] T025 [US2] Implement static and animated presentation modes for immersive stimuli in src/xr-session.js

**Checkpoint**: User Stories 1 and 2 work independently: configuration remains usable and immersive
presentation reflects the current per-eye configuration.

---

## Phase 5: User Story 3 - Recover When Immersive Mode Is Unavailable (Priority: P3)

**Goal**: Users on unsupported devices or after permission/session failure stay in the regular
browser view with configuration preserved.

**Independent Test**: Open the website where immersive VR is unavailable, or decline immersive
permission, select Enter VR, and confirm the page keeps all selected values and remains usable.

### Implementation for User Story 3

- [X] T026 [US3] Implement unsupported WebXR and unsupported immersive-vr detection paths in src/xr-session.js
- [X] T027 [US3] Preserve Experiment Configuration values after failed session startup, permission denial, or session end in src/config.js
- [X] T028 [US3] Render clear fallback and failure messages without leaving the configuration screen in src/app.js
- [X] T029 [P] [US3] Add accessible fallback message styling and focus-visible states in styles.css
- [X] T030 [US3] Ensure session end returns focus and interaction to the regular configuration screen in src/xr-session.js

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate static deployment, accessibility, performance, and documentation across all
stories.

- [X] T031 [P] Validate the app with the configuration-view quickstart scenario and record any notes in specs/001-binocular-xr-experiments/quickstart.md
- [X] T032 [P] Validate unsupported or failed immersive entry behavior and record any notes in specs/001-binocular-xr-experiments/quickstart.md
- [ ] T033 Validate immersive per-eye presentation on a compatible device and record any notes in specs/001-binocular-xr-experiments/quickstart.md
- [X] T034 Verify static GitHub Pages readiness, relative asset paths, and absence of database/backend assumptions in index.html
- [X] T035 Review accessibility labels, keyboard navigation, and text fit across the configuration UI in index.html and styles.css

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; MVP scope.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and integrates with configuration
  state from US1 for full value.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and can be implemented alongside
  US2 after session plumbing begins.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 Configure Per-Eye Stimuli**: No dependency on other stories after foundation.
- **US2 Enter Immersive Per-Eye Presentation**: Requires the shared configuration model and benefits
  from US1 controls to provide meaningful input.
- **US3 Recover When Immersive Mode Is Unavailable**: Requires the session state model and can be
  validated without a compatible immersive device.

### Within Each User Story

- Data/state updates before UI synchronization.
- UI structure before interaction wiring.
- Shared stimulus factories before preview or immersive rendering.
- Immersive support detection before session startup and per-eye presentation.
- Failure handling before final quickstart validation.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001 is understood.
- T006, T007, and T009 can run in parallel during the foundational phase.
- T012 and T015 can run in parallel during US1 after configuration controls are defined.
- T020 can run in parallel with T021 during US2.
- T029 can run in parallel with T026 through T028 during US3.
- T031 and T032 can run in parallel during polish; T033 requires compatible immersive hardware.

---

## Parallel Example: User Story 1

```text
Task: "Style the two-column configuration layout, controls, previews, and mobile stacking behavior in styles.css"
Task: "Implement regular browser preview scene setup and resize handling in src/preview.js"
```

## Parallel Example: User Story 2

```text
Task: "Style the Enter VR action, disabled state, active state, and immersive status messages in styles.css"
Task: "Implement immersive support detection and Enter VR button enablement in src/xr-session.js"
```

## Parallel Example: User Story 3

```text
Task: "Implement unsupported WebXR and unsupported immersive-vr detection paths in src/xr-session.js"
Task: "Add accessible fallback message styling and focus-visible states in styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the regular browser configuration flow independently.
5. Deploy or demo the static configuration MVP if desired.

### Incremental Delivery

1. Setup plus Foundation: static page shell, CDN imports, shared state, and stimulus catalog.
2. Add US1: independent per-eye browser configuration and preview.
3. Add US2: immersive VR entry and per-eye presentation.
4. Add US3: robust unsupported-device and failure fallback.
5. Polish: quickstart validation, accessibility, and static deployment checks.

### Parallel Team Strategy

1. Complete Setup and Foundational tasks together.
2. Work on US1 controls and preview in parallel where file ownership permits.
3. After shared session plumbing exists, split US2 immersive rendering and US3 fallback styling.
4. Run quickstart validations after each completed story checkpoint.

## Notes

- [P] tasks touch separate files or are otherwise safe to run in parallel.
- [US1], [US2], and [US3] labels map directly to prioritized user stories in spec.md.
- Keep external JavaScript dependencies pinned to explicit CDN versions.
- Keep all runtime behavior compatible with static GitHub Pages hosting.
