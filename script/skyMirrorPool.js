// skyMirrorPool.js
// Interaction stub for the Sky Mirror Pool.
// Purpose: reflect sky and fragments of memory as visitors approach.

export function createPoolState() {
  return { ripples: 0 };
}

/**
 * onApproach(state, api)
 * Triggered when a visitor comes near.
 * api should implement: showReflection(type), playSound(name)
 */
export function onApproach(state, api) {
  api.showReflection("sky");
  api.playSound("water-soft");
}

/**
 * onTouch(state, api)
 * Touching the pool surface adds ripples and reveals memory fragments.
 */
export function onTouch(state, api) {
  state.ripples += 1;
  api.showReflection("memory-fragment-" + state.ripples);
  api.playSound("ripple");
}

/**
 * reset(state, api)
 * Clears ripples, returns to clear sky reflection.
 */
export function reset(state, api) {
  state.ripples = 0;
  api.showReflection("sky");
}
