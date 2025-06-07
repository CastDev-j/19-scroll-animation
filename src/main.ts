import * as THREE from "three";
import GUI from "lil-gui";
import { Timer } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

// set up the gui

const gui = new GUI({
  width: 300,
  autoPlace: true,
});

// set up texture loader

const textureLoader = new THREE.TextureLoader();
textureLoader.setPath("textures/");

// set up canvas

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const [width, height] = [
  (canvas.width = window.innerWidth),
  (canvas.height = window.innerHeight),
];

// set up scene

const scene = new THREE.Scene();

// objects

const objectsFolder = gui.addFolder("Objects").close();

const parameters = {
  color: "#8c00ff",
};

const toonTexture = textureLoader.load("/gradients/3.jpg");
toonTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: parameters.color,
  gradientMap: toonTexture,
});

objectsFolder
  .addColor(parameters, "color")
  .name("Color")
  .onChange(() => {
    material.color.set(parameters.color);
    particlesMaterial.color.set(parameters.color);
  });

const objectDistance = 6;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const meshes = [mesh1, mesh2, mesh3];

scene.add(...meshes);

// adding particles

const bufferGeometry = new THREE.BufferGeometry();

const count = 1000;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectDistance * 0.5 +
    (Math.random() - 0.5) * objectDistance * meshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

bufferGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: parameters.color,
  sizeAttenuation: true,
  depthWrite: false,
});

const particles = new THREE.Points(bufferGeometry, particlesMaterial);
particles.position.y = -objectDistance * 1.5;
scene.add(particles);

// set up axes helper

const axesHelperFolder = gui.addFolder("Axes Helper").close();

const axesHelper = new THREE.AxesHelper(0.1);
axesHelper.visible = false;

axesHelperFolder.add(axesHelper, "visible").name("Show Axes Helper");

scene.add(axesHelper);
// set up camera

const cameraGroup = new THREE.Group();

const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.set(0, 0, 5);

cameraGroup.add(camera);

scene.add(cameraGroup);

// set up lights

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);

directionalLight.position.set(1, 1, 0);

scene.add(directionalLight);

// set up renderer

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// scroll

let scrollY = window.scrollY;
let currentSection = -1;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / window.innerHeight);

  if (newSection != currentSection) {
    currentSection = newSection;

    console.log(`Current section: ${currentSection}`);

    gsap.to(meshes[currentSection].rotation, {
      duration: 2,
      x: '+=3.141592653589793',
      y: '+=6.283185307179586',
      z: '+=3.141592653589793',

      ease: "power2.inOut",
    });
  }
});

// cursor

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5;
  cursor.y = event.clientY / window.innerHeight - 0.5;
});

// Animation loop

const timer = new Timer();

const tick = () => {
  timer.update();
  // const elapsedTime = timer.getElapsed();
  const deltaTime = timer.getDelta();

  window.requestAnimationFrame(tick);

  // animations
  meshes.forEach((mesh) => {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.125;
  });

  // update camera position based on scroll

  camera.position.y = (-scrollY * objectDistance) / window.innerHeight;

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * deltaTime * 0.5;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * deltaTime * 0.5;

  // render
  renderer.render(scene, camera);
};

tick();

// Handle window resize

window.addEventListener("resize", () => {
  const [width, height] = [
    (canvas.width = window.innerWidth),
    (canvas.height = window.innerHeight),
  ];

  // Update camera aspect ratio and renderer size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
