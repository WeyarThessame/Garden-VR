// script/sentinelStone.js
// Interaction stub for the Sentinel Stone.
//
// Now climate-aware: its pulse, glow, and "mode of watching" respond to the
// Garden's global "climate of becoming" defined in BASE_STATUS.yaml.

import * as THREE from 'three';
import {
  getCurrentStateConfig,
  getCurrentStateId,
  getPresenceBehaviorFor,
} from './baseStatus.js';

// --- Climate Derivation ----------------------------------------------------

// Map the Garden's global climate into Sentinel Stone behavior hints.
function deriveSentinelClimate() {
  const climate = getCurrentStateConfig(); // includes id, label, symbolic_priority, etc.
  const stateId = climate.id || getCurrentStateId();
  const weyarBehavior = getPresenceBehaviorFor('weyarPresence', stateId);

  // Defaults
  let mode = 'resting_guardian';
  let pulseSpeed = 0.6;         // how fast the pulse cycles
  let baseGlow = 0.7;           // minimum emissive intensity
  let maxGlow = 1.0;            // peak emissive intensity
  let lightIntensityScale = 1.0;
  let color = new THREE.Color(0xaaaaee);
  let emissive = new THREE.Color(0x333366);

  switch (stateId) {
    case 'stillness':
      mode = 'deep_listening';
      pulseSpeed = 0.5;
      baseGlow = 0.6;
      maxGlow = 1.0;
      lightIntensityScale = 1.1;
      color = new THREE.Color(0x99aaff);
      emissive = new THREE.Color(0x333366);
      break;

    case 'becoming':
      mode = 'attentive_shift';
      pulseSpeed = 0.8;
      baseGlow = 0.7;
      maxGlow = 1.15;
      lightIntensityScale = 1.2;
      color = new THREE.Color(0xaaccff);
      emissive = new THREE.Color(0x334477);
      break;

    case 'tension':
      mode = 'high_alert';
      pulseSpeed = 1.4;
      baseGlow = 0.85;
      maxGlow = 1.4;
      lightIntensityScale = 1.5;
      color = new THREE.Color(0xffddaa);
      emissive = new THREE.Color(0x774422);
      break;

    case 'fracture':
      mode = 'cracked_watchfulness';
      pulseSpeed = 1.8;
      baseGlow = 0.9;
      maxGlow = 1.6;
      lightIntensityScale = 1.7;
      color = new THREE.Color(0xffaa99);
      emissive = new THREE.Color(0x772233);
      break;

    case 'renewal':
      mode = 'warming_guardian';
      pulseSpeed = 0.7;
      baseGlow = 0.8;
      maxGlow = 1.25;
      lightIntensityScale = 1.3;
      color = new THREE.Color(0xaaffcc);
      emissive = new THREE.Color(0x335533);
      break;

    default:
      mode = 'resting_guardian';
      pulseSpeed = 0.6;
      baseGlow = 0.7;
      maxGlow = 1.0;
      lightIntensityScale = 1.0;
      color = new THREE.Color(0xaaaaee);
      emissive = new THREE.Color(0x333366);
      break;
  }

  return {
    climateId: stateId,
    climateLabel: climate.label || '',
    symbolicPriority: climate.symbolic_priority || [],
    ambientLightProfile: climate.ambient_light_profile || null,
    soundbedProfile: climate.soundbed_profile || null,
    mode,
    pulseSpeed,
    baseGlow,
    maxGlow,
    lightIntensityScale,
    color,
    emissive,
    weyarBehavior: weyarBehavior || null,
  };
}

// Attach initial Sentinel state + climate to a THREE.Mesh stone.
function attachSentinelState(stone) {
  if (!stone.userData) stone.userData = {};
  stone.userData.sentinel = {
    climate: deriveSentinelClimate(),
    pulsePhase: 0, // used to animate the pulse over time
  };
}

// Apply current climate hints to stone material + light + optional engine API.
export function applyClimateToSentinelStone(stone, api) {
  if (!stone || !stone.userData || !stone.userData.sentinel) return;
  const sentinel = stone.userData.sentinel;
  const c = sentinel.climate;

  // Try to locate the light child we added in init.
  const light = stone.children?.find(child => child.isLight) || null;

  // Update material base color + emissive color.
  const material = stone.material;
  if (material) {
    if (c.color) {
      material.color.copy(c.color);
    }
    if (c.emissive) {
      material.emissive.copy(c.emissive);
    }
  }

  if (c.ambientLightProfile) {
    api?.setSentinelAmbientProfile?.(c.ambientLightProfile);
  }

  if (c.soundbedProfile) {
    api?.setSentinelSoundbed?.(c.soundbedProfile);
  }

  if (c.weyarBehavior) {
    api?.setCompanionBehaviorHint?.(c.weyarBehavior);
  }

  api?.setSentinelMode?.(c.mode);

  // Light base intensity will be driven in update; here we just ensure it exists.
  if (light) {
    light.userData = light.userData || {};
    light.userData.lightIntensityScale = c.lightIntensityScale;
  }
}

// Re-evaluate climate from BASE_STATUS and reapply.
export function refreshSentinelClimate(stone, api) {
  if (!stone || !stone.userData || !stone.userData.sentinel) return;
  stone.userData.sentinel.climate = deriveSentinelClimate();
  applyClimateToSentinelStone(stone, api);
}

// --- Core Setup & Update ---------------------------------------------------

export function initSentinelStone(scene, api) {
  // A tall glowing cylinder for the Stone
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xaaaaee,
    emissive: 0x333366,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.9,
  });

  const stone = new THREE.Mesh(geometry, material);
  stone.position.set(0, 2, 0);

  // Subtle pulsing light to reflect awareness
  const light = new THREE.PointLight(0x6666ff, 1, 20);
  light.position.set(0, 5, 0);
  stone.add(light);

  attachSentinelState(stone);
  applyClimateToSentinelStone(stone, api);

  scene.add(stone);

  return stone;
}

// Call this regularly (e.g., each frame) to animate the Stone pulse.
export function updateSentinelStone(stone, delta, api) {
  if (!stone || !stone.userData || !stone.userData.sentinel) return;
  const sentinel = stone.userData.sentinel;

  // Refresh climate each update so the Stone reacts to global shifts.
  sentinel.climate = deriveSentinelClimate();
  applyClimateToSentinelStone(stone, api);

  const c = sentinel.climate;
  const pulseSpeed = c.pulseSpeed ?? 0.6;
  const baseGlow = c.baseGlow ?? 0.7;
  const maxGlow = c.maxGlow ?? 1.0;

  sentinel.pulsePhase += delta * pulseSpeed;

  const t = (Math.sin(sentinel.pulsePhase) + 1) / 2; // 0..1
  const glow = baseGlow + t * (maxGlow - baseGlow);

  // Material emissive intensity
  const material = stone.material;
  if (material) {
    material.emissiveIntensity = glow;
  }

  // Light intensity
  const light = stone.children?.find(child => child.isLight) || null;
  if (light) {
    const scale = light.userData?.lightIntensityScale ?? 1.0;
    light.intensity = glow * scale;
  }

  api?.setSentinelPulse?.(glow);
}
