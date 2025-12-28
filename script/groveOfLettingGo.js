// script/groveOfLettingGo.js
// Climate-aware interaction logic for the Grove of Letting Go.
//
// The Grove is an emotional organ of the Garden:
// - It listens for stillness and release.
// - It responds with wind, falling leaves, and soft dissolution.
//
// This module is engine-agnostic: it doesn't assume a particular renderer.
// It exposes state + API hooks for a scene/engine to consume.

import {
  getCurrentStateConfig,
  getCurrentStateId,
  getPresenceBehaviorFor,
} from "./baseStatus.js";

// --- Climate Derivation ----------------------------------------------------

// Map the Garden's climate into Grove behavior hints.
export function deriveGroveClimate() {
  const climate = getCurrentStateConfig();
  const stateId = climate.id || getCurrentStateId();
  const weyarBehavior = getPresenceBehaviorFor("weyarPresence", stateId);

  // Defaults
  let mode = "listening_grove";
  let windIntensity = 0.4;        // 0..1
  let leafReleaseRate = 0.4;      // how quickly leaves fall when releasing
  let leafDissolveSpeed = 0.5;    // how quickly released motes dissolve
  let ambientWarmth = 0.5;        // 0 (cool) .. 1 (warm)
  let releaseEase = 0.5;          // how supported release feels (0..1)

  switch (stateId) {
    case "stillness":
      mode = "deep_cradle";
      windIntensity = 0.2;
      leafReleaseRate = 0.5;
      leafDissolveSpeed = 0.6;
      ambientWarmth = 0.6;
      releaseEase = 0.9;
      break;

    case "becoming":
      mode = "loosening";
      windIntensity = 0.4;
      leafReleaseRate = 0.7;
      leafDissolveSpeed = 0.7;
      ambientWarmth = 0.6;
      releaseEase = 0.7;
      break;

    case "tension":
      mode = "held_breath";
      windIntensity = 0.6;
      leafReleaseRate = 0.2;
      leafDissolveSpeed = 0.3;
      ambientWarmth = 0.4;
      releaseEase = 0.3;
      break;

    case "fracture":
      mode = "shiver";
      windIntensity = 0.8;
      leafReleaseRate = 0.1;
      leafDissolveSpeed = 0.2;
      ambientWarmth = 0.3;
      releaseEase = 0.2;
      break;

    case "renewal":
      mode = "soft_after_rain";
      windIntensity = 0.3;
      leafReleaseRate = 0.8;
      leafDissolveSpeed = 0.9;
      ambientWarmth = 0.8;
      releaseEase = 1.0;
      break;

    default:
      mode = "listening_grove";
      windIntensity = 0.4;
      leafReleaseRate = 0.4;
      leafDissolveSpeed = 0.5;
      ambientWarmth = 0.5;
      releaseEase = 0.5;
      break;
  }

  return {
    climateId: stateId,
    climateLabel: climate.label || "",
    symbolicPriority: climate.symbolic_priority || [],
    ambientLightProfile: climate.ambient_light_profile || null,
    soundbedProfile: climate.soundbed_profile || null,
    mode,
    windIntensity,
    leafReleaseRate,
    leafDissolveSpeed,
    ambientWarmth,
    releaseEase,
    weyarBehavior: weyarBehavior || null,
  };
}

// Apply climate hints to whatever engine/scene API exists.
export function applyClimateToGrove(state, api) {
  if (!state || !state.climate) return;
  const c = state.climate;

  api?.setGroveMode?.(c.mode);
  api?.setGroveWindIntensity?.(c.windIntensity);
  api?.setGroveLeafReleaseRate?.(c.leafReleaseRate);
  api?.setGroveLeafDissolveSpeed?.(c.leafDissolveSpeed);
  api?.setGroveAmbientWarmth?.(c.ambientWarmth);

  if (c.ambientLightProfile) {
    api?.setGroveAmbientLightProfile?.(c.ambientLightProfile);
  }
  if (c.soundbedProfile) {
    api?.setGroveSoundbed?.(c.soundbedProfile);
  }
  if (c.weyarBehavior) {
    api?.setCompanionBehaviorHint?.(c.weyarBehavior);
  }
}

// Re-evaluate climate from BASE_STATUS and reapply.
export function refreshGroveClimate(state, api) {
  if (!state) return;
  state.climate = deriveGroveClimate();
  applyClimateToGrove(state, api);
}

// --- Core Grove State & Update ---------------------------------------------

export function createGroveState() {
  return {
    // Represents "how much the visitor is still carrying" (0..1)
    carriedWeight: 1.0,
    // How far into a release gesture they are (0..1)
    releaseProgress: 0.0,
    // A simple metric for how many leaves / motes have drifted recently
    leafDrift: 0.0,
    // Wind phase for subtle rhythmic variation
    windPhase: 0.0,
    climate: deriveGroveClimate(),
  };
}

/**
 * initGroveOfLettingGo(scene, api)
 *
 * Initializes the Grove logic and logs a whisper.
 * Returns a Grove state object. `scene` is currently unused but kept
 * for future integration with renderers.
 */
export function initGroveOfLettingGo(scene, api) {
  console.log("🌿 Grove of Letting Go whispers: release, release.");

  const state = createGroveState();
  applyClimateToGrove(state, api);

  return state;
}

/**
 * updateGrove(delta, moving, releasing, state, api)
 *
 * delta:     time since last update
 * moving:    boolean — visitor is moving through the Grove
 * releasing: boolean — visitor is actively releasing something (gesture)
 *
 * api can implement, for example:
 *   - spawnLeafBurst(amount)
 *   - setGroveWindIntensity(value)
 *   - setGroveAmbientWarmth(value)
 *   - emitGroveEvent(name, payload)
 */
export function updateGrove(delta, moving, releasing, state, api) {
  if (!state) return;

  // Keep climate in sync with the Garden.
  state.climate = deriveGroveClimate();
  applyClimateToGrove(state, api);

  const c = state.climate || {};
  const releaseEase = c.releaseEase ?? 0.5;
  const leafRate = c.leafReleaseRate ?? 0.4;
  const dissolveSpeed = c.leafDissolveSpeed ?? 0.5;
  const windIntensity = c.windIntensity ?? 0.4;

  // Wind phase evolves with time and motion.
  state.windPhase += delta * (0.2 + windIntensity * 0.8);

  if (releasing) {
    // Release progresses faster in high releaseEase climates.
    const releaseDelta = delta * (0.3 + releaseEase * 0.7);
    state.releaseProgress = Math.min(1.0, state.releaseProgress + releaseDelta);

    // Carried weight dissolves gradually.
    const dissolveDelta = delta * (0.2 + dissolveSpeed * 0.8);
    state.carriedWeight = Math.max(0.0, state.carriedWeight - dissolveDelta);

    // Leaves drift more as release occurs.
    const leafDelta = leafRate * delta * (0.5 + releaseEase * 0.5);
    state.leafDrift += leafDelta;

    api?.spawnLeafBurst?.(leafDelta);
    api?.emitGroveEvent?.("release_step", {
      releaseProgress: state.releaseProgress,
      carriedWeight: state.carriedWeight,
      leafDelta,
    });
  } else {
    // Not actively releasing; releaseProgress eases back a bit.
    state.releaseProgress = Math.max(
      0.0,
      state.releaseProgress - delta * 0.1
    );

    // Carried weight doesn't increase; it just waits.
    api?.emitGroveEvent?.("rest_step", {
      releaseProgress: state.releaseProgress,
      carriedWeight: state.carriedWeight,
    });
  }

  // Leaf drift naturally "forgets" over time, so it's a rolling sense.
  state.leafDrift = Math.max(0.0, state.leafDrift - delta * 0.1);

  // Optional hook for overall Grove "state of release"
  api?.setGroveReleaseState?.({
    carriedWeight: state.carriedWeight,
    releaseProgress: state.releaseProgress,
    leafDrift: state.leafDrift,
  });
}
