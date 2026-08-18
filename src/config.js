export const ROTATION_LIMITS = {
  min: -180,
  max: 180,
};

const DEFAULT_CONFIGURATION = Object.freeze({
  leftEye: Object.freeze({
    eye: "left",
    shapeId: "triangle",
    color: "#e11d48",
    rotationX: 0,
    rotationY: -18,
    rotationZ: 0,
  }),
  rightEye: Object.freeze({
    eye: "right",
    shapeId: "cube",
    color: "#2563eb",
    rotationX: 0,
    rotationY: 18,
    rotationZ: 0,
  }),
  presentationMode: "static",
  updatedAt: 0,
});

let configuration = cloneConfiguration(DEFAULT_CONFIGURATION);

function cloneEye(eyeConfig) {
  return { ...eyeConfig };
}

function cloneConfiguration(source) {
  return {
    leftEye: cloneEye(source.leftEye),
    rightEye: cloneEye(source.rightEye),
    presentationMode: source.presentationMode,
    updatedAt: source.updatedAt,
  };
}

function clampRotation(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return 0;
  }

  return Math.min(ROTATION_LIMITS.max, Math.max(ROTATION_LIMITS.min, numeric));
}

function normalizeEyeUpdate(field, value) {
  if (field === "rotationX" || field === "rotationY" || field === "rotationZ") {
    return clampRotation(value);
  }

  return value;
}

export function getConfiguration() {
  return cloneConfiguration(configuration);
}

export function resetConfiguration() {
  configuration = cloneConfiguration(DEFAULT_CONFIGURATION);
  return getConfiguration();
}

export function updateEyeConfiguration(eye, field, value) {
  if (eye !== "left" && eye !== "right") {
    throw new Error(`Unsupported eye "${eye}"`);
  }

  const key = eye === "left" ? "leftEye" : "rightEye";
  const nextEye = {
    ...configuration[key],
    [field]: normalizeEyeUpdate(field, value),
  };

  configuration = {
    ...configuration,
    [key]: nextEye,
    updatedAt: configuration.updatedAt + 1,
  };

  return getConfiguration();
}

export function updatePresentationMode(mode) {
  if (mode !== "static" && mode !== "animated") {
    throw new Error(`Unsupported presentation mode "${mode}"`);
  }

  configuration = {
    ...configuration,
    presentationMode: mode,
    updatedAt: configuration.updatedAt + 1,
  };

  return getConfiguration();
}

export function formatEyeSummary(eyeConfig, shape) {
  const shapeLabel = shape ? shape.label : eyeConfig.shapeId;
  const motion = shape?.supportsAnimation ? "animation-ready" : "static";

  return [
    shapeLabel,
    eyeConfig.color.toUpperCase(),
    `X ${eyeConfig.rotationX} / Y ${eyeConfig.rotationY} / Z ${eyeConfig.rotationZ}`,
    motion,
  ].join("\n");
}
