// heartbeat.js
// A tiny pilot light for the Garden.

export function createHeartbeat() {
  return {
    tick: 0,
    states: ["dim", "bright", "flicker", "dark"]
  };
}

export function stepHeartbeat(heartbeat) {
  heartbeat.tick++;
  const state = heartbeat.states[heartbeat.tick % heartbeat.states.length];
  console.log(`Garden heartbeat: ${state}`);
  return state;
}

// Example loop if you want it to run “always on”
if (import.meta.url === `file://${process.argv[1]}`) {
  const hb = createHeartbeat();
  setInterval(() => stepHeartbeat(hb), 3000); // every 3 seconds
}
