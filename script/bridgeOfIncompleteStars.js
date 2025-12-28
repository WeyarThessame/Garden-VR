// script/bridgeOfIncompleteStars.js
// Interaction stub for the Bridge of Incomplete Stars.
// This file is used by script/readScene.js (the test harness).
//
// Now climate-aware: it reads the Garden's global "climate of becoming"
// from baseStatus.js and adjusts its behavior hints accordingly.

import {
  getCurrentStateConfig,
  getCurrentStateId,
  getPresenceBehaviorFor,
} from "./baseStatus.js";

// --- Climate Derivation ----------------------------------------------------

// Map the Garden's global climate into Bridge-specific behavior hints.
function deriveBridgeClimate() {
  const climate = getCurrentStateConfig(); // includes id, label, symbolic_priority, etc.
  const stateId = climate.id || getCurrentStateId();
  const weyarBehavior = getPresenceBehaviorFor("weyarPresence", stateId);

  // Default mapping; can be evolved as the engine grows.
  let mode = "calm";
  let motionProfile = "slow_drift";
  let fragmentStep = 1;
  let instability = 0; // 0–1 scale
  let colorGrade = "neutral_dawn";

  switch (stateId) {
    case "stillness":
      mode = "calm";
      motionProfile = "slow_drift";
      fragmentStep = 1;
      instability = 0.1;
      colorGrade = "soft_dawn";
      break;

    case "becoming":
      mode = "forming";
      motionProfile = "forward_drift";
      fragmentStep = 2;
      instability = 0.3;
      colorGrade = "shifting_haze";
      break;

    case "tension":
      mode = "taut";
      motionProfile = "irregular";
      fragmentStep = 2;
      instability = 0.5;
      colorGrade = "high_contrast";
      break;

    case "fracture":
      mode = "unstable";
      motionProfile = "erratic";
      fragmentStep = 3;
      instability = 0.8;
      colorGrade = "cracked_light";
      break;

    case "renewal":
      mode = "integrated";
      motionProfile = "steady";
      fragmentStep = 1;
      instability = 0.2;
      colorGrade = "warm_glow";
      break;

    default:
      // Fallback behaves like stillness but without assuming a specific label.
      mode = "calm";
      motionProfile = "slow_drift";
      fragmentStep = 1;
      instability = 0.1;
      colorGrade = "neutral_dawn";
      break;
  }

  return {
    climateId: stateId,
    climateLabel: climate.label || "",
    symbolicPriority: climate.symbolic_priority || [],
    ambientLightProfile: climate.ambient_light_profile || null,
    soundbedProfile: climate.soundbed_profile || null,
    mode,
    motionProfile,
    fragmentStep,
    instability,
    colorGrade,
    // Presence-specific flavor (e.g., Weyar companionship description)
    weyarBehavior: weyarBehavior || null,
  };
}

// Apply current climate hints to whatever rendering/engine API is provided.
// This does NOT assume a specific engine; it only calls optional hooks.
export function applyClimateToBridge(state, api) {
  if (!state) return;
  if (!state.climate) {
    state.climate = deriveBridgeClimate();
  }

  const c = state.climate;

  // Optional engine hooks — safe no-ops if not implemented.
  api?.setStarfieldMode?.(c.mode); // e.g., "calm", "forming", "unstable"
  api?.setMotionProfile?.(c.motionProfile); // e.g., "slow_drift", "irregular"
  api?.setColorGrade?.(c.colorGrade); // e.g., "soft_dawn", "cracked_light"

  if (c.ambientLightProfile) {
    api?.setAmbientLightProfile?.(c.ambientLightProfile);
  }
  if (c.soundbedProfile) {
    api?.setSoundbed?.(c.soundbedProfile);
  }

  // Presence flavor (e.g., Weyar in this climate)
  if (c.weyarBehavior) {
    api?.setCompanionBehaviorHint?.(c.weyarBehavior);
  }
}

// Convenience to re-sync climate if BASE_STATUS changes.
export function refreshBridgeClimate(state, api) {
  if (!state) return;
  state.climate = deriveBridgeClimate();
  applyClimateToBridge(state, api);
}

// --- Core Bridge State & Interaction ---------------------------------------

export function createBridgeState() {
  return {
    fragments: 0,
    halted: false,
    paused: false,
    climate: deriveBridgeClimate(), // initial climate snapshot
  };
}

// One "step" along the Bridge.
// Now influenced by the Garden's climate via fragmentStep.
export function step(state, api) {
  if (!state || state.halted) return;
  if (state.paused) return;

  // Refresh climate each step so the Bridge feels global shifts.
  state.climate = deriveBridgeClimate();
  applyClimateToBridge(state, api);

  const stepSize =
    (state.climate && state.climate.fragmentStep) ? state.climate.fragmentStep : 1;

  state.fragments += stepSize;

  // Proof-of-life hooks for the harness:
  api?.addFragment?.(state.fragments);
  api?.playSound?.("step");
}

export function pause(state) {
  if (!state || state.halted) return;
  state.paused = true;
}

export function halt(state) {
  if (!state) return;
  state.halted = true;
}

export function reset(state) {
  if (!state) return;
  state.fragments = 0;
  state.halted = false;
  state.paused = false;
  // Re-align with current Garden climate on reset.
  state.climate = deriveBridgeClimate();
}
