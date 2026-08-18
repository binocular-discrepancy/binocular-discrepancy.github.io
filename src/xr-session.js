import * as THREE from "three";
import { createLights, createReferenceEnvironment, createStimulusMesh } from "./stimuli.js";

const LEFT_EYE_LAYER = 1;
const RIGHT_EYE_LAYER = 2;

let activeSession = null;
let renderer = null;
let scene = null;
let camera = null;
let leftStimulus = null;
let rightStimulus = null;
let animationMode = "static";
let exitFocusTarget = null;
let onStatusChange = () => {};

function isSecureEnoughForXR() {
  return window.isSecureContext || window.location.hostname === "localhost";
}

function createRenderer() {
  const xrRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  xrRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  xrRenderer.outputColorSpace = THREE.SRGBColorSpace;
  xrRenderer.xr.enabled = true;
  document.body.appendChild(xrRenderer.domElement);
  xrRenderer.domElement.className = "xr-canvas";
  xrRenderer.domElement.hidden = true;
  return xrRenderer;
}

function disposeMesh(mesh) {
  if (!mesh) {
    return;
  }

  mesh.geometry.dispose();
  mesh.material.dispose();
}

function cleanupScene() {
  disposeMesh(leftStimulus);
  disposeMesh(rightStimulus);
  leftStimulus = null;
  rightStimulus = null;
  scene = null;
  camera = null;
}

function buildImmersiveScene(configuration) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f7f5);
  scene.add(createReferenceEnvironment(), createLights());

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 0);
  camera.layers.enable(LEFT_EYE_LAYER);
  camera.layers.enable(RIGHT_EYE_LAYER);

  leftStimulus = createStimulusMesh(configuration.leftEye);
  rightStimulus = createStimulusMesh(configuration.rightEye);
  leftStimulus.position.set(-0.06, 0, -1.55);
  rightStimulus.position.set(0.06, 0, -1.55);
  leftStimulus.layers.set(LEFT_EYE_LAYER);
  rightStimulus.layers.set(RIGHT_EYE_LAYER);

  scene.add(leftStimulus, rightStimulus);
  animationMode = configuration.presentationMode;
}

function configurePerEyeLayers() {
  const xrCamera = renderer.xr.getCamera(camera);
  const cameras = xrCamera.cameras ?? [];

  if (cameras[0]) {
    cameras[0].layers.enable(0);
    cameras[0].layers.enable(LEFT_EYE_LAYER);
    cameras[0].layers.disable(RIGHT_EYE_LAYER);
  }

  if (cameras[1]) {
    cameras[1].layers.enable(0);
    cameras[1].layers.enable(RIGHT_EYE_LAYER);
    cameras[1].layers.disable(LEFT_EYE_LAYER);
  }
}

function renderFrame(time) {
  configurePerEyeLayers();

  if (animationMode === "animated") {
    const spin = time * 0.00045;
    if (leftStimulus) {
      leftStimulus.rotation.y += 0.01;
      leftStimulus.position.x = -0.1 + Math.sin(spin) * 0.04;
    }
    if (rightStimulus) {
      rightStimulus.rotation.y -= 0.01;
      rightStimulus.position.x = 0.1 + Math.cos(spin) * 0.04;
    }
  }

  renderer.render(scene, camera);
}

function reportStatus(message, tone = "info") {
  onStatusChange(message, tone);
}

export async function detectImmersiveSupport() {
  if (!isSecureEnoughForXR()) {
    return {
      isSupported: false,
      message: "Immersive VR requires HTTPS or localhost. Configuration remains available.",
      tone: "warn",
    };
  }

  if (!("xr" in navigator)) {
    return {
      isSupported: false,
      message: "WebXR is not available in this browser. Configuration remains available.",
      tone: "warn",
    };
  }

  try {
    const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
    return {
      isSupported,
      message: isSupported
        ? "Immersive VR is available. Configure both eyes, then enter VR."
        : "Immersive VR is not supported on this device. Configuration remains available.",
      tone: isSupported ? "info" : "warn",
    };
  } catch (error) {
    return {
      isSupported: false,
      message: `Could not check immersive support: ${error.message}`,
      tone: "warn",
    };
  }
}

export async function initializeXRSessionControls({ button, getConfiguration, setStatus }) {
  exitFocusTarget = button;
  onStatusChange = setStatus;

  const support = await detectImmersiveSupport();
  setStatus(support.message, support.tone);
  button.disabled = !support.isSupported;

  button.addEventListener("click", async () => {
    if (activeSession) {
      await activeSession.end();
      return;
    }

    await enterImmersiveVR(getConfiguration());
  });
}

export async function enterImmersiveVR(configuration) {
  reportStatus("Requesting immersive VR...", "info");

  try {
    if (!renderer) {
      renderer = createRenderer();
    }

    buildImmersiveScene(configuration);
    activeSession = await navigator.xr.requestSession("immersive-vr", {
      optionalFeatures: ["local-floor", "bounded-floor"],
    });

    activeSession.addEventListener("end", () => {
      activeSession = null;
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.domElement.hidden = true;
      }
      cleanupScene();
      reportStatus("Immersive session ended. Configuration is still available.", "info");
      if (exitFocusTarget) {
        exitFocusTarget.focus({ preventScroll: false });
      }
    });

    renderer.domElement.hidden = false;
    await renderer.xr.setSession(activeSession);
    renderer.setAnimationLoop(renderFrame);
    reportStatus("Presenting configured per-eye stimuli in immersive VR.", "info");
  } catch (error) {
    activeSession = null;
    if (renderer) {
      renderer.setAnimationLoop(null);
      renderer.domElement.hidden = true;
    }
    cleanupScene();
    reportStatus(`Unable to enter VR: ${error.message}`, "error");
    if (exitFocusTarget) {
      exitFocusTarget.focus({ preventScroll: false });
    }
  }
}
