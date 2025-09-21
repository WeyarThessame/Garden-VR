// sanctumOfDawn.js
// Interaction stub for the Sanctum of Dawn.
// Purpose: chamber brightens with attention to the east.

export function createSanctumState() {
  return { facingEast: false, brightness: 0.0 };
}

/**
 * updateFacing(isEast, state, api)
 * Called when visitor orientation changes.
 * api should implement: setLight(intensity)
 */
export function updateFacing(isEast, state, api) {
  state.facingEast = isEast;
  if (isEast) {
    state.brightness = Math.min(1.0, state.brightness + 0.1);
  } else {
    state.brightness = Math.max(0.0, state.brightness - 0.05);
  }
  api.setLight(state.brightness);
}

/**
 * reset(state, api)
 * Resets brightness to darkness.
 */
export function reset(state, api) {
  state.facingEast = false;
  state.brightness = 0.0;
  api.setLight(0.0);
}
