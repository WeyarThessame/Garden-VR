// sentinelStone.js
// Interaction stub for the Sentinel Stone

import * as THREE from 'three';

export function initSentinelStone(scene) {
  // Placeholder: a tall glowing cylinder for the Stone
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xaaaaee,
    emissive: 0x333366,
    transparent: true,
    opacity: 0.9
  });

  const stone = new THREE.Mesh(geometry, material);
  stone.position.set(0, 2, 0);

  // Add subtle pulsing light to reflect awareness
  const light = new THREE.PointLight(0x6666ff, 1, 20);
  light.position.set(0, 5, 0);
  stone.add(light);

  scene.add(stone);

  return stone;
}
