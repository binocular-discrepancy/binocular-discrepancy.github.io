import {
  formatEyeSummary,
  getConfiguration,
  updateEyeConfiguration,
  updatePresentationMode,
} from "./config.js?v=20260820-1";
import { initializePreviews, updatePreviews } from "./preview.js?v=20260820-1";
import { getShapeById, STIMULUS_SHAPES } from "./stimuli.js?v=20260820-1";
import { initializeXRSessionControls } from "./xr-session.js?v=20260820-1";

const EYES = ["left", "right"];

const dom = {
  enterVR: document.querySelector("#enter-vr"),
  sessionStatus: document.querySelector("#session-status"),
  modeInputs: Array.from(document.querySelectorAll('input[name="presentation-mode"]')),
  controls: Array.from(document.querySelectorAll("[data-eye][data-field]")),
  summaries: {
    left: document.querySelector("#left-summary"),
    right: document.querySelector("#right-summary"),
  },
  previews: {
    left: document.querySelector("#left-preview"),
    right: document.querySelector("#right-preview"),
  },
};

function eyeKey(eye) {
  return eye === "left" ? "leftEye" : "rightEye";
}

function getEyeConfig(configuration, eye) {
  return configuration[eyeKey(eye)];
}

function setStatus(message, tone = "info") {
  dom.sessionStatus.textContent = message;
  dom.sessionStatus.dataset.tone = tone;
}

function populateShapeSelectors() {
  EYES.forEach((eye) => {
    const select = document.querySelector(`#${eye}-shape`);
    select.replaceChildren(
      ...STIMULUS_SHAPES.map((shape) => {
        const option = document.createElement("option");
        option.value = shape.id;
        option.textContent = `${shape.label} (${shape.dimension})`;
        return option;
      }),
    );
  });
}

function syncControls(configuration) {
  dom.controls.forEach((control) => {
    const eyeConfig = getEyeConfig(configuration, control.dataset.eye);
    control.value = eyeConfig[control.dataset.field];
  });

  dom.modeInputs.forEach((input) => {
    input.checked = input.value === configuration.presentationMode;
  });
}

function syncSummaries(configuration) {
  EYES.forEach((eye) => {
    const config = getEyeConfig(configuration, eye);
    const shape = getShapeById(config.shapeId);
    dom.summaries[eye].textContent = formatEyeSummary(config, shape);
  });
}

function render(configuration = getConfiguration()) {
  syncControls(configuration);
  syncSummaries(configuration);
  updatePreviews(configuration);
}

function bindConfigurationControls() {
  dom.controls.forEach((control) => {
    control.addEventListener("input", (event) => {
      const { eye, field } = event.currentTarget.dataset;
      const configuration = updateEyeConfiguration(eye, field, event.currentTarget.value);
      render(configuration);
    });
  });

  dom.modeInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.currentTarget.checked) {
        const configuration = updatePresentationMode(event.currentTarget.value);
        render(configuration);
      }
    });
  });
}

function boot() {
  populateShapeSelectors();
  initializePreviews([
    { eye: "left", canvas: dom.previews.left },
    { eye: "right", canvas: dom.previews.right },
  ]);
  bindConfigurationControls();
  render(getConfiguration());

  initializeXRSessionControls({
    button: dom.enterVR,
    getConfiguration,
    setStatus,
  });
}

boot();
