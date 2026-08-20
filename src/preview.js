import * as THREE from "three";
import {
  createLights,
  createReferenceEnvironment,
  createStimulusMesh,
} from "./stimuli.js?v=20260820-1";

const previews = new Map();

function createPreview(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.add(createReferenceEnvironment(), createLights());

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 4.1);

  return {
    canvas,
    renderer,
    scene,
    camera,
    mesh: null,
  };
}

function resizePreview(preview) {
  const rect = preview.canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const needsResize =
    preview.canvas.width !== Math.floor(width * window.devicePixelRatio) ||
    preview.canvas.height !== Math.floor(height * window.devicePixelRatio);

  if (needsResize) {
    preview.renderer.setSize(width, height, false);
    preview.camera.aspect = width / height;
    preview.camera.updateProjectionMatrix();
  }
}

function renderPreview(preview) {
  resizePreview(preview);
  preview.renderer.render(preview.scene, preview.camera);
}

export function initializePreviews(targets) {
  targets.forEach(({ eye, canvas }) => {
    previews.set(eye, createPreview(canvas));
  });

  window.addEventListener("resize", () => {
    previews.forEach(renderPreview);
  });
}

export function updatePreview(eye, eyeConfig) {
  const preview = previews.get(eye);
  if (!preview) {
    return;
  }

  if (preview.mesh) {
    preview.scene.remove(preview.mesh);
    preview.mesh.geometry.dispose();
    preview.mesh.material.dispose();
  }

  preview.mesh = createStimulusMesh(eyeConfig);
  preview.scene.add(preview.mesh);
  renderPreview(preview);
}

export function updatePreviews(configuration) {
  updatePreview("left", configuration.leftEye);
  updatePreview("right", configuration.rightEye);
}
