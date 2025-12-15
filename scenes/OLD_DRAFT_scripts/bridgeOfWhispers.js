// bridgeOfWhispers.js
// Interaction stub for the Bridge of Whispers.
// Purpose: footsteps and pauses release faint voices into the mist.

export function createBridgeState() {
  return { whispers: [] };
}

/**
 * step(state, api)
 * Each step releases a faint whisper.
 * api should implement: playWhisper(text)
 */
export function step(state, api) {
  const whisper = "echo-" + (state.whispers.length + 1);
  state.whispers.push(whisper);
  api.playWhisper(whisper);
}

/**
 * pause(state, api)
 * Standing still makes older whispers rise from the mist.
 */
export function pause(state, api) {
  for (const whisper of state.whispers) {
    api.playWhisper(whisper);
  }
}

/**
 * reset(state, api)
 * Clears whispers.
 */
export function reset(state, api) {
  state.whispers = [];
}
