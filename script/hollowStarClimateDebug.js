// script/hollowStarClimateDebug.js
// Debug harness for the Hollow Star.
// Shows how its glow responds to the Garden's global climate.

import {
  createStarState,
  onUpdate,
  reset,
} from "./hollowStar.js";

function makeDebugApi() {
  return {
    setGlow(value) {
      const v = typeof value === "number" ? value.toFixed(3) : value;
      console.log(`→ [api] setGlow(${v})`);
    },
    setStarCoreMode(mode) {
      console.log(`→ [api] setStarCoreMode(${mode})`);
    },
    setAmbientLightProfile(profile) {
      console.log(`→ [api] setAmbientLightProfile(${profile})`);
    },
    setSoundbed(profile) {
      console.log(`→ [api] setSoundbed(${profile})`);
    },
    setCompanionBehaviorHint(hint) {
      console.log(`→ [api] setCompanionBehaviorHint(${hint})`);
    },
  };
}

function printClimate(state, label) {
  const c = state.climate;
  console.log(`\n=== ${label} ===`);
  console.log(`Climate ID:       ${c.climateId}`);
  console.log(`Climate Label:    ${c.climateLabel}`);
  console.log(`Mode:             ${c.mode}`);
  console.log(`Glow +:           ${c.glowIncreaseRate}`);
  console.log(`Glow -:           ${c.glowDecayRate}`);
  console.log(`Max Glow:         ${c.maxGlow}`);
  console.log(`Stability:        ${c.stability}`);
  if (c.ambientLightProfile) {
    console.log(`Ambient Light:    ${c.ambientLightProfile}`);
  }
  if (c.soundbedProfile) {
    console.log(`Soundbed:         ${c.soundbedProfile}`);
  }
  if (c.symbolicPriority && c.symbolicPriority.length) {
    console.log("Symbolic Priority:");
    for (const p of c.symbolicPriority) {
      console.log(`  - ${p}`);
    }
  }
  if (c.weyarBehavior) {
    console.log(`Weyar Behavior:   ${c.weyarBehavior}`);
  }
  console.log("=============================\n");
}

function runDebug() {
  const api = makeDebugApi();
  const state = createStarState();

  printClimate(state, "Initial Hollow Star Climate");

  console.log(">>> Phase 1: Stillness (not moving)");
  for (let i = 1; i <= 5; i++) {
    console.log(`\n--- Stillness tick ${i} (delta=1.0) ---`);
    onUpdate(1.0, false, state, api);
    console.log(`State.glow = ${state.glow.toFixed(3)}`);
  }

  console.log("\n>>> Phase 2: Movement (moving = true)");
  for (let i = 1; i <= 5; i++) {
    console.log(`\n--- Movement tick ${i} (delta=1.0) ---`);
    onUpdate(1.0, true, state, api);
    console.log(`State.glow = ${state.glow.toFixed(3)}`);
  }

  console.log("\n>>> Resetting star");
  reset(state, api);
  console.log(`State.glow after reset = ${state.glow.toFixed(3)}`);

  console.log("\n=== Hollow Star debug run complete ===");
}

try {
  runDebug();
} catch (err) {
  console.error("[hollowStarClimateDebug] Error:", err.message);
  process.exit(1);
}
