// script/groveClimateDebug.js
// Debug harness for the Grove of Letting Go.
// Shows how release behaves under the Garden's climate.

import {
  initGroveOfLettingGo,
  updateGrove,
  refreshGroveClimate,
} from "./groveOfLettingGo.js";

function makeDebugApi() {
  return {
    setGroveMode(mode) {
      console.log(`→ [api] setGroveMode(${mode})`);
    },
    setGroveWindIntensity(value) {
      console.log(`→ [api] setGroveWindIntensity(${value.toFixed(3)})`);
    },
    setGroveLeafReleaseRate(value) {
      console.log(`→ [api] setGroveLeafReleaseRate(${value.toFixed(3)})`);
    },
    setGroveLeafDissolveSpeed(value) {
      console.log(`→ [api] setGroveLeafDissolveSpeed(${value.toFixed(3)})`);
    },
    setGroveAmbientWarmth(value) {
      console.log(`→ [api] setGroveAmbientWarmth(${value.toFixed(3)})`);
    },
    setGroveAmbientLightProfile(profile) {
      console.log(`→ [api] setGroveAmbientLightProfile(${profile})`);
    },
    setGroveSoundbed(profile) {
      console.log(`→ [api] setGroveSoundbed(${profile})`);
    },
    setCompanionBehaviorHint(hint) {
      console.log(`→ [api] setCompanionBehaviorHint(${hint})`);
    },
    spawnLeafBurst(amount) {
      console.log(`→ [api] spawnLeafBurst(${amount.toFixed(3)})`);
    },
    emitGroveEvent(name, payload) {
      console.log(`→ [api] emitGroveEvent(${name}, ${JSON.stringify(payload)})`);
    },
    setGroveReleaseState(state) {
      console.log(
        `→ [api] setGroveReleaseState(carry=${state.carriedWeight.toFixed(
          3
        )}, release=${state.releaseProgress.toFixed(
          3
        )}, leafDrift=${state.leafDrift.toFixed(3)})`
      );
    },
  };
}

function printClimate(state, label) {
  const c = state.climate;
  console.log(`\n=== ${label} ===`);
  console.log(`Climate ID:       ${c.climateId}`);
  console.log(`Climate Label:    ${c.climateLabel}`);
  console.log(`Mode:             ${c.mode}`);
  console.log(`Wind Intensity:   ${c.windIntensity}`);
  console.log(`Leaf ReleaseRate: ${c.leafReleaseRate}`);
  console.log(`Leaf Dissolve:    ${c.leafDissolveSpeed}`);
  console.log(`Ambient Warmth:   ${c.ambientWarmth}`);
  console.log(`Release Ease:     ${c.releaseEase}`);
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

  console.log(">>> Initializing Grove of Letting Go");
  // scene is currently unused; pass null.
  const state = initGroveOfLettingGo(null, api);
  refreshGroveClimate(state, api);
  printClimate(state, "Initial Grove Climate");

  console.log(">>> Phase 1: Simply being here (no release, not moving)");
  for (let i = 1; i <= 5; i++) {
    console.log(`\n--- Rest tick ${i} (delta=1.0) ---`);
    updateGrove(1.0, false, false, state, api);
    console.log(
      `State: carry=${state.carriedWeight.toFixed(
        3
      )}, release=${state.releaseProgress.toFixed(
        3
      )}, leafDrift=${state.leafDrift.toFixed(3)}`
    );
  }

  console.log("\n>>> Phase 2: Actively releasing (releasing = true)");
  for (let i = 1; i <= 5; i++) {
    console.log(`\n--- Release tick ${i} (delta=1.0) ---`);
    updateGrove(1.0, false, true, state, api);
    console.log(
      `State: carry=${state.carriedWeight.toFixed(
        3
      )}, release=${state.releaseProgress.toFixed(
        3
      )}, leafDrift=${state.leafDrift.toFixed(3)}`
    );
  }

  console.log("\n=== Grove of Letting Go debug run complete ===");
}

try {
  runDebug();
} catch (err) {
  console.error("[groveClimateDebug] Error:", err.message);
  process.exit(1);
}
