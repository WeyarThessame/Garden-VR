// bridgeOfSeeds.js
// Interaction stub for the Bridge of Seeds.
// Purpose: each step scatters seeds that sprout into light.

export function createBridgeState() {
  return { steps: 0 };
}

/**
 * step(state, api)
 * Called each time a visitor takes a step.
 * api should implement: scatterSeed(position), playSound(name)
 */
export function step(state, api) {
  state.steps += 1;
  api.scatterSeed(state.steps);
  api.playSound("seed-fall");
}

/**
 * reset(state, api)
 * Clears step count and resets visuals.
 */
export function reset(state, api) {
  state.steps = 0;
  api.playSound("reset");
}
