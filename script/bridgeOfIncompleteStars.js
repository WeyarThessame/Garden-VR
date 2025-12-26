// script/bridgeOfIncompleteStars.js
// Interaction stub for the Bridge of Incomplete Stars.
// This file is used by script/readScene.js (the test harness).

export function createBridgeState() {
  return {
    fragments: 0,
    halted: false,
    paused: false,
  };
}

export function step(state, api) {
  if (!state || state.halted) return;
  if (state.paused) return;

  state.fragments += 1;

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
}
