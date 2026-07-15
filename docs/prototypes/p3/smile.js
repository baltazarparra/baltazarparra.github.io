import * as THREE from "three";
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.querySelector("#smile-canvas");

if (canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  scene.add(new THREE.HemisphereLight(0xf2f0ea, 0x15171a, 2.3));

  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 4, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xe65b2f, 5.5);
  rim.position.set(-4, 1, 2);
  scene.add(rim);

  const loader = new GLTFLoader();
  let model;

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / Math.max(clientHeight, 1);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };

  loader.load(
    "/smile.glb",
    (gltf) => {
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xc8c7c2,
            roughness: 0.52,
            metalness: 0.18,
          });
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 2.8 / Math.max(size.x, size.y, size.z);

      model.position.sub(center);
      model.scale.setScalar(scale);
      model.rotation.set(-0.08, -0.2, -0.08);
      scene.add(model);

      canvas.closest(".smile-stage")?.classList.add("is-ready");
      resize();
    },
    undefined,
    () => resize(),
  );

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
}
