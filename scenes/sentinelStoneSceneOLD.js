import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

// Basic setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Ground plane
const groundGeo = new THREE.PlaneGeometry(20, 20);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Sentinel Stone placeholder (a tall cylinder)
const stoneGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
const stoneMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
const sentinelStone = new THREE.Mesh(stoneGeo, stoneMat);
sentinelStone.position.set(0, 1.5, -3);
scene.add(sentinelStone);

// Animate
function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}

animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
