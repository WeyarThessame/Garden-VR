// riftStone.js
// Interaction stub for the Riftstone.
// Purpose: respond differently depending on approach side or direct touch.

export function createRiftState() {
  return { lastApproach: null, touched: false };
}

/**
 * onApproach(side, state, api)
 * side = "left" or "right"
 * api should implement: setGlow(intensity), setHum(pitch)
 */
export function onApproach(side, state, api) {
  state.lastApproach = side;
  if (side === "left") {
    api.setGlow(0.8);
    api.setHum("deep");
  } else if (side === "right") {
    api.setGlow(0.5);
    api.setHum("flicker");
  }
}

/**
 * onTouch(state, api)
 * Touching the crack itself.
 * api should implement: playSound(name)
 */
export function onTouch(state, api) {
  state.touched = !state.touched;
  if (state.touched) {
    api.playSound("stone-strain");
  } else {
    api.playSound("silence");
  }
}
