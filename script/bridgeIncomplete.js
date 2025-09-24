// bridgeIncomplete.js
// Interaction stub for the Bridge Incomplete.
// Purpose: extend the bridge step by step as a visitor walks forward.

export function createBridgeState() {
  return { length: 1, halted: false };
}

/**
 * stepForward(state, api)
 * Each call adds one plank if not halted.
 * api should implement: addPlank(index), playSound(name)
 */
export function stepForward(state, api) {
  if (!state.halted) {
    state.length += 1;
    api.addPlank(state.length);
    api.playSound("plank-placed");
  }
}

/**
 * turnBack(state, api)
 * Halts further extension until reset.
 */
export function turnBack(state, api) {
  state.halted = true;
  api.playSound("rope-creak");
}

/**
 * reset(state, api)
 * Resets bridge to single starting plank.
 */
export function reset(state, api) {
  state.length = 1;
  state.halted = false;
  api.playSound("reset");
}
