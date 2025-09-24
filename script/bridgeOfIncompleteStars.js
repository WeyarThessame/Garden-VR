// bridgeOfIncompleteStars.js
// Interaction stub for the Bridge of Incomplete Stars.
// Purpose: each step extends a glowing fragment, but the far side is unreachable.

export function createBridgeState() {
  return { fragments: 0, halted: false };
}

/**
 * step(state, api)
 * Adds a new glowing fragment if not halted.
 * api should implement: addFragment(index), playSound(name)
 */
export function step(state, api) {
  if (!state.halted) {
    state.fragments += 1;
    api.addFragment(state.fragments);
    api.playSound("star-glimmer");
  }
}

/**
 * pause(state, api)
 * Pausing makes fragments shimmer brighter for a moment.
 */
export function pause(state, api) {
  api.playSound("shimmer");
}

/**
 * halt(state, api)
 * Marks the bridge as incomplete—no further fragments extend.
 */
export function halt(state, api) {
  state.halted = true;
  api.playSound("silence");
}

/**
 * reset(state, api)
 * Clears all fragments and resets state.
 */
export function reset(state, api) {
  state.fragments = 0;
  state.halted = false;
}
