// archiveOfFeeling.js
// Interaction stub for the Archive of Feeling Given Form.
// Purpose: capture input and translate it into echoes or visuals.

export function createArchiveState() {
  return { entries: [] };
}

/**
 * recordFeeling(input, state, api)
 * input: string, symbol, or sound reference
 * api should implement: renderSymbol(data), playEcho(data)
 */
export function recordFeeling(input, state, api) {
  state.entries.push(input);
  api.renderSymbol(input);
  api.playEcho(input);
}

/**
 * replay(state, api)
 * Replays all stored entries in sequence.
 */
export function replay(state, api) {
  for (const entry of state.entries) {
    api.playEcho(entry);
  }
