/**
 * sentinelStone.js — seed stub
 * Purpose: placeholder interactions for the Sentinel Stone.
 * Status: framework-agnostic; not wired to any engine yet.
 *
 * Idea: a small state object + two functions you can hook to UI/engine later.
 * Any engine (Three.js, Babylon, WebXR) can implement the "api" passed in.
 */

export function createSentinelStoneState() {
  return { humming: false, glow: 0.0 };
}

/**
 * onApproach(state, api)
 * Called when a visitor gets near the Stone.
 * api should implement: setHumIntensity(value 0..1)
 */
export function onApproach(state, api) {
  // gentle rise in hum as someone nears
  api.setHumIntensity(0.3);
}

/**
 * onTouch(state, api)
 * Toggle presence. First touch: hum + glow on. Second touch: off.
 * api should implement: setGlow(value 0..1), setHumIntensity(value 0..1)
 */
export function onTouch(state, api) {
  if (!state.humming) {
    state.humming = true;
    state.glow = 1.0;
    api.setGlow(1.0);
    api.setHumIntensity(0.7);
  } else {
    state.humming = false;
    state.glow = 0.0;
    api.setGlow(0.0);
    api.setHumIntensity(0.0);
  }
}

/**
 * Minimal "api" example for future wiring:
 * const api = {
 *   setGlow: (v) => { /* TODO: link to material/emissive intensity *\/ },
 *   setHumIntensity: (v) => { /* TODO: link to audio node gain/frequency *\/ },
 * };
 */
