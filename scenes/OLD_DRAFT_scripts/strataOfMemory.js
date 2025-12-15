// strataOfMemory.js
// Interaction stub for the Strata of Memory.
// Purpose: respond to descent through layers (Surface → Middle → Deep).

export function createStrataState() {
  return { layer: "Surface" };
}

/**
 * descend(state, api)
 * Move one layer deeper: Surface → Middle → Deep.
 * api should implement: setLayerVisual(name), setLayerSound(name).
 */
export function descend(state, api) {
  if (state.layer === "Surface") {
    state.layer = "Middle";
    api.setLayerVisual("Middle");
    api.setLayerSound("stone-shift");
  } else if (state.layer === "Middle") {
    state.layer = "Deep";
    api.setLayerVisual("Deep");
    api.setLayerSound("low-rumble");
  } else {
    // already at deepest layer
    api.setLayerSound("silence");
  }
}

/**
 * reset(state, api)
 * Return to Surface layer.
 */
export function reset(state, api) {
  state.layer = "Surface";
  api.setLayerVisual("Surface");
  api.setLayerSound("light-wind");
}
