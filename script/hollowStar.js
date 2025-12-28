// script/hollowStar.js
// Interaction stub for the Hollow Star.
// Purpose: glow increases with stillness, fades if rushed past.
// Now climate-aware: its behavior is modulated by the Garden's
// global "climate of becoming" defined in BASE_STATUS.yaml.

import {
  getCurrentStateConfig,
  getCurrentStateId,
  getPresenceBehaviorFor,
} from "./baseStatus.js";

// --- Climate Derivation ----------------------------------------------------

// Map the Garden's climate into Hollow Star behavior hints.
function deriveHollowClimate() {
  const climate = getCurrentStateConfig(); // includes id, label, symbolic_priority, etc.
  const stateId = climate.id || getCurrentStateId();
  const weyarBehavior = getPresenceBehaviorFor("weyarPresence", stateId);

  // Defaults
  let glowIncreaseRate = 0.1;  // how quickly it brightens when still
  let glowDecayRate = 0.5;     // how quickly it fades when moving
  let maxGlow = 1.0;           // maximum glow
  let stability = 0.5;         // how resistant it is to movement (0–1)
  let mode = "listening";

  switch (stateId) {
    case "stillness":
      mode = "deep_stillness";
      glowIncreaseRate = 0.15;
      glowDecayRate = 0.2;
      maxGlow = 1.0;
      stability = 0.9;
      break;

    case "becoming":
      mode = "unfolding";
      glowIncreaseRate = 0.12;
      glowDecayRate = 0.25;
      maxGlow = 0.95;
      stability = 0.7;
      break;

    case "tension":
      mode = "focused";
      glowIncreaseRate = 0.08;
      glowDecayRate = 0.4;
      maxGlow = 0.9;
      stability = 0.4;
      break;

    case "fracture":
      mode = "tremor";
      glowIncreaseRate = 0.05;
      glowDecayRate = 0.6;
      maxGlow = 0.8;
      stability = 0.2;
      break;

    case "renewal":
      mode = "warming";
      glowIncreaseRate = 0.2;
      glowDecayRate = 0.15;
      maxGlow = 1.0;
      stability = 0.85;
      break;

    default:
      mode = "listening";
      glowIncreaseRate = 0.1;
      glowDecayRate = 0.5;
      maxGlow = 1.0;
      stability = 0.5;
      break;
  }

  return {
    climateId: stateId,
    climateLabel: climate.label || "",
    symbolicPriority: climate.symbolic_priority || [],
    ambientLightProfile: climate.ambient_light_profile || null,
    soundbedProfile: climate.soundbed_profile || null,
    mode,
    glowIncreaseRate,
    glowDecayRate,
    maxGlow,
    stability,
    weyarBehavior: weyarBehavior || null,
  };
}

// Apply climate hints to whatever rendering/engine API exists.
export function applyClimateToHollowStar(state, api) {
  if (!state) return;
  if (!state.climate) {
    state.climate = deriveHollowClimate();
  }

  const c = state.climate;

  // Optional engine hooks.
  api?.setStarCoreMode?.(c.mode);
  if (c.ambientLightProfile) {
    api?.setAmbientLightProfile?.(c.ambientLightProfile);
  }
  if (c.soundbedProfile) {
    api?.setSoundbed?.(c.soundbedProfile);
  }
  if (c.weyarBehavior) {
    api?.setCompanionBehaviorHint?.(c.weyarBehavior);
  }
}

// Convenience to resync climate if BASE_STATUS changes.
export function refreshHollowClimate(state, api) {
  if (!state) return;
  state.climate = deriveHollowClimate();
  applyClimateToHollowStar(state, api);
}

// --- Core Hollow Star State & Interaction ----------------------------------

export function createStarState() {
  return {
    glow: 0.0,
    timer: 0,
    climate: deriveHollowClimate(),
  };
}

/**
 * onUpdate(delta, moving, state, api)
 * delta: time since last update
 * moving: boolean, true if visitor is moving
 * api should implement: setGlow(value)
 */
export function onUpdate(delta, moving, state, api) {
  if (!state) return;

  // Keep climate in sync with the Garden.
  state.climate = deriveHollowClimate();
  applyClimateToHollowStar(state, api);

  const c = state.climate || {};
  const inc = c.glowIncreaseRate ?? 0.1;
  const dec = c.glowDecayRate ?? 0.5;
  const maxGlow = c.maxGlow ?? 1.0;

  if (moving) {
    // In more stable climates, movement is "forgiven" a bit more.
    const effectiveDecay = dec * (1 + (1 - (c.stability ?? 0.5)));
    state.glow = Math.max(0, state.glow - delta * effectiveDecay);
    state.timer = 0;
  } else {
    // Stillness lets the star gather and focus light.
    const effectiveIncrease = inc * (1 + (c.stability ?? 0.5));
    state.timer += delta;
    state.glow = Math.min(maxGlow, state.glow + delta * effectiveIncrease);
  }

  api?.setGlow?.(state.glow);
}

/**
 * reset(state, api)
 * Resets glow to zero.
 */
export function reset(state, api) {
  if (!state) return;
  state.glow = 0.0;
  state.timer = 0;
  state.climate = deriveHollowClimate();
  api?.setGlow?.(0.0);
}
