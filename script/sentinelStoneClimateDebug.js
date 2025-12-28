// script/sentinelStoneClimateDebug.js
// Debug harness for the Sentinel Stone.
// Shows how its pulse responds to the Garden's global climate of becoming.

import * as THREE from 'three';
import {
  initSentinelStone,
  updateSentinelStone,
  refreshSentinelClimate,
} from './sentinelStone.js';

function makeDebugScene() {
  return {
    children: [],
    add(obj) {
      this.children.push(obj);
      const type = obj.type || 'Object3D';
      console.log(`[scene] add: ${type}`);
    },
  };
}

function makeDebugApi() {
  return {
    setSentinelMode(mode) {
      console.log(`→ [api] setSentinelMode(${mode})`);
    },
    setSentinelAmbientProfile(profile) {
      console.log(`→ [api] setSentinelAmbientProfile(${profile})`);
    },
    setSentinelSoundbed(profile) {
      console.log(`→ [api] setSentinelSoundbed(${profile})`);
    },
    setCompanionBehaviorHint(hint) {
      console.log(`→ [api] setCompanionBehaviorHint(${hint})`);
    },
    setSentinelPulse(value) {
      const v = typeof value === 'number' ? value.toFixed(3) : value;
      console.log(`→ [api] setSentinelPulse(${v})`);
    },
  };
}

function printClimate(stone, label) {
  const sentinel = stone.userData?.sentinel;
  if (!sentinel || !sentinel.climate) {
    console.log(`\n=== ${label} ===`);
    console.log('No Sentinel climate attached.');
    console.log('=============================\n');
    return;
  }

  const c = sentinel.climate;
  console.log(`\n=== ${label} ===`);
  console.log(`Climate ID:       ${c.climateId}`);
  console.log(`Climate Label:    ${c.climateLabel}`);
  console.log(`Mode:             ${c.mode}`);
  console.log(`Pulse Speed:      ${c.pulseSpeed}`);
  console.log(`Base Glow:        ${c.baseGlow}`);
  console.log(`Max Glow:         ${c.maxGlow}`);
  console.log(`Light Scale:      ${c.lightIntensityScale}`);
  if (c.ambientLightProfile) {
    console.log(`Ambient Light:    ${c.ambientLightProfile}`);
  }
  if (c.soundbedProfile) {
    console.log(`Soundbed:         ${c.soundbedProfile}`);
  }
  if (c.symbolicPriority && c.symbolicPriority.length) {
    console.log('Symbolic Priority:');
    for (const p of c.symbolicPriority) {
      console.log(`  - ${p}`);
    }
  }
  if (c.weyarBehavior) {
    console.log(`Weyar Behavior:   ${c.weyarBehavior}`);
  }
  console.log('=============================\n');
}

function runDebug() {
  const scene = makeDebugScene();
  const api = makeDebugApi();

  console.log('>>> Initializing Sentinel Stone');
  const stone = initSentinelStone(scene, api);

  // Ensure climate is up to date.
  refreshSentinelClimate(stone, api);
  printClimate(stone, 'Initial Sentinel Climate');

  console.log('>>> Pulsing Sentinel over 8 ticks (delta=1.0)');
  for (let i = 1; i <= 8; i++) {
    console.log(`\n--- Pulse tick ${i} (delta=1.0) ---`);
    updateSentinelStone(stone, 1.0, api);

    const material = stone.material;
    const emissiveIntensity =
      material && typeof material.emissiveIntensity === 'number'
        ? material.emissiveIntensity.toFixed(3)
        : 'n/a';

    const light = stone.children?.find(child => child.isLight) || null;
    const lightIntensity =
      light && typeof light.intensity === 'number'
        ? light.intensity.toFixed(3)
        : 'n/a';

    console.log(`material.emissiveIntensity = ${emissiveIntensity}`);
    console.log(`light.intensity            = ${lightIntensity}`);
  }

  console.log('\n=== Sentinel Stone debug run complete ===');
}

try {
  runDebug();
} catch (err) {
  console.error('[sentinelStoneClimateDebug] Error:', err.message);
  process.exit(1);
}
