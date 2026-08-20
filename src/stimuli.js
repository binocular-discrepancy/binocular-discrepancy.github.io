import * as THREE from "three";

export const SHARED_SCENE_LAYER = 0;

export const STIMULUS_SHAPES = Object.freeze([
  Object.freeze({ id: "triangle", label: "Triangle", dimension: "2D", supportsAnimation: true }),
  Object.freeze({ id: "square", label: "Square", dimension: "2D", supportsAnimation: true }),
  Object.freeze({ id: "ring", label: "Ring", dimension: "2D", supportsAnimation: true }),
  Object.freeze({ id: "cube", label: "Cube", dimension: "3D", supportsAnimation: true }),
  Object.freeze({ id: "sphere", label: "Sphere", dimension: "3D", supportsAnimation: true }),
  Object.freeze({ id: "octahedron", label: "Octahedron", dimension: "3D", supportsAnimation: true }),
]);

const SHAPE_BY_ID = new Map(STIMULUS_SHAPES.map((shape) => [shape.id, shape]));

export function getShapeById(shapeId) {
  return SHAPE_BY_ID.get(shapeId) ?? STIMULUS_SHAPES[0];
}

export function degreesToRadians(degrees) {
  return (Number(degrees) * Math.PI) / 180;
}

export function applyStimulusRotation(mesh, eyeConfig) {
  mesh.rotation.set(
    degreesToRadians(eyeConfig.rotationX),
    degreesToRadians(eyeConfig.rotationY),
    degreesToRadians(eyeConfig.rotationZ),
  );
}

function createMaterial(color, dimension) {
  const base = {
    color,
    roughness: 0.46,
    metalness: 0.08,
    side: THREE.DoubleSide,
  };

  if (dimension === "2D") {
    return new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  }

  return new THREE.MeshStandardMaterial(base);
}

function createGeometry(shapeId) {
  switch (shapeId) {
    case "triangle":
      return new THREE.CircleGeometry(0.9, 3);
    case "square":
      return new THREE.PlaneGeometry(1.35, 1.35);
    case "ring":
      return new THREE.RingGeometry(0.42, 0.9, 48);
    case "sphere":
      return new THREE.SphereGeometry(0.78, 48, 24);
    case "octahedron":
      return new THREE.OctahedronGeometry(0.9, 0);
    case "cube":
    default:
      return new THREE.BoxGeometry(1.25, 1.25, 1.25);
  }
}

export function createStimulusMesh(eyeConfig) {
  const shape = getShapeById(eyeConfig.shapeId);
  const geometry = createGeometry(shape.id);
  const material = createMaterial(eyeConfig.color, shape.dimension);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.name = `${eyeConfig.eye}-${shape.id}-stimulus`;
  mesh.userData.eye = eyeConfig.eye;
  mesh.userData.shapeId = shape.id;
  applyStimulusRotation(mesh, eyeConfig);

  if (shape.dimension === "2D") {
    mesh.position.z = -1.2;
  }

  return mesh;
}

export function createLights() {
  const group = new THREE.Group();
  const ambient = new THREE.HemisphereLight(0xf7fbff, 0x56635e, 1.8);
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);

  group.add(ambient, key);
  group.traverse((object) => object.layers.set(SHARED_SCENE_LAYER));
  return group;
}

export function createReferenceEnvironment() {
  const group = new THREE.Group();
  const grid = new THREE.GridHelper(8, 16, 0x6b8379, 0xc8d4cf);
  grid.position.y = -1.45;
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4.5),
    new THREE.MeshBasicMaterial({ color: 0xf3f7f4, side: THREE.DoubleSide }),
  );
  back.position.set(0, 0.25, -2.4);

  group.add(back, grid);
  group.traverse((object) => object.layers.set(SHARED_SCENE_LAYER));
  return group;
}
