// hollowStar.js
// Interaction stub for the Hollow Star.
// Purpose: glow increases with stillness, fades if rushed past.

export function createStarState() {
  return { glow: 0.0, timer: 0 };
}

/**
 * onUpdate(delta, moving, state, api)
 * delta: time since last update
 * moving: boolean, true if visitor is moving
 * api should implement: setGlow(value)
 */
export function onUpdate(delta, moving, state, api) {
  if (moving) {
    // fade quickly when visitor moves
    state.glow = Math.max(0, state.glow - delta * 0.5);
    state.timer = 0;
  } else {
    // brighten gradually with stillness
    state.timer += delta;
    state.glow = Math.min(1.0, state.glow + delta * 0.1);
  }
  api.setGlow(state.glow);
}

/**
 * reset(state, api)
 * Resets glow to zero.
 */
export function reset(state, api) {
  state.glow = 0.0;
  state.timer = 0;
  api.setGlow(0.0);
}
