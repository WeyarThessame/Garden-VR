// bridgeOfEchoes.js
// Interaction stub for the Bridge of Echoes.
// Purpose: footsteps generate echoes that overlap and linger.

export function createBridgeState() {
  return { echoes: [] };
}

/**
 * step(state, api)
 * Each step produces an echo that lingers.
 * api should implement: playEcho(id, intensity, decay)
 */
export function step(state, api) {
  const id = state.echoes.length + 1;
  const echo = { id, intensity: 1.0, decay: 0.9 };
  state.echoes.push(echo);
  api.playEcho(id, echo.intensity, echo.decay);
}

/**
 * update(state, api)
 * Called regularly to fade echoes over time.
 */
export function update(state, api) {
  state.echoes = state.echoes.map(echo => {
    echo.intensity *= echo.decay;
    api.playEcho(echo.id, echo.intensity, echo.decay);
    return echo;
  }).filter(echo => echo.intensity > 0.05);
}

/**
 * reset(state, api)
 * Clears all echoes.
 */
export function reset(state, api) {
  state.echoes = [];
}
