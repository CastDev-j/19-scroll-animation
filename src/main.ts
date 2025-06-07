import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
// import { Timer } from "three/examples/jsm/Addons.js";

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
  color: "#ff0000",
};

const toonTexture = textureLoader.load('/gradients/3.jpg')

const material = new THREE.MeshToonMaterial({
  color: parameters.color,
  al
});

objectsFolder
  .addColor(parameters, "color")
  .name("Color")
  .onFinishChange(() => {
    material.color.set(parameters.color);
  });

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

scene.add(mesh1, mesh2, mesh3);

// set up axes helper

const axesHelperFolder = gui.addFolder("Axes Helper").close();

const axesHelper = new THREE.AxesHelper(0.1);

axesHelperFolder.add(axesHelper, "visible").name("Show Axes Helper");

scene.add(axesHelper);
// set up camera

const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.set(0, 0, 5);

scene.add(camera);

// set up lights

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);

directionalLight.position.set(1, 1, 0);

scene.add(directionalLight);

// set up renderer

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation loop

// const timer = new Timer();

const tick = () => {
  // timer.update();
  // const elapsedTime = timer.getElapsed();

  window.requestAnimationFrame(tick);

  // animations

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

// gsap animations

gsap.registerPlugin(ScrollTrigger);

gsap.to("body", {
  scrollTrigger: {
    start: "400px 300px",
    end: "500px 200px",
    // markers: true,
  },
});
