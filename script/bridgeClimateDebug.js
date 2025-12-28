// script/bridgeClimateDebug.js
// Debug harness for the Bridge of Incomplete Stars.
// Shows how the Bridge "feels" the Garden's global climate of becoming.

import {
  createBridgeState,
  step,
} from "./bridgeOfIncompleteStars.js";

function makeDebugApi() {
  return {
    setStarfieldMode(mode) {
      console.log(`→ [api] setStarfieldMode(${mode})`);
    },
    setMotionProfile(profile) {
      console.log(`→ [api] setMotionProfile(${profile})`);
    },
    setColorGrade(grade) {
      console.log(`→ [api] setColorGrade(${grade})`);
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
    addFragment(count) {
      console.log(`→ [api] addFragment(${count})`);
    },
    playSound(name) {
      console.log(`→ [api] playSound(${name})`);
    },
  };
}

function printClimateState(state, label) {
  const c = state.climate;
  console.log(`\n=== ${label} ===`);
  console.log(`Climate ID:       ${c.climateId}`);
  console.log(`Climate Label:    ${c.climateLabel}`);
  console.log(`Mode:             ${c.mode}`);
  console.log(`Motion Profile:   ${c.motionProfile}`);
  console.log(`Color Grade:      ${c.colorGrade}`);
  console.log(`Fragment Step:    ${c.fragmentStep}`);
  console.log(`Instability:      ${c.instability}`);
  console.log(`Ambient Light:    ${c.ambientLightProfile}`);
  console.log(`Soundbed:         ${c.soundbedProfile}`);
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
  const state = createBridgeState();

  printClimateState(state, "Initial Bridge Climate");

  // Take a few "steps" along the Bridge to show how fragments advance
  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Step ${i} ---`);
    step(state, api);
    console.log(`State.fragments = ${state.fragments}`);
    if (state.climate) {
      console.log(
        `Current climateId=${state.climate.climateId}, fragmentStep=${state.climate.fragmentStep}`
      );
    }
  }

  console.log("\n=== Debug run complete ===");
}

try {
  runDebug();
} catch (err) {
  console.error("[bridgeClimateDebug] Error:", err.message);
  process.exit(1);
}
