// script/showBaseStatus.js
// Quick inspection of the Garden's global climate of becoming.

import { getBaseStatus, getCurrentStateConfig } from "./baseStatus.js";

function run() {
  const full = getBaseStatus();
  const current = getCurrentStateConfig();

  console.log("=== BASE_STATUS Overview ===");
  console.log("id:", full.id);
  console.log("version:", full.version);
  console.log("last_updated:", full.last_updated);
  console.log("default_state:", full.default_state);
  console.log("states available:", Object.keys(full.states));

  console.log("\n=== Current Active State ===");
  console.log(JSON.stringify(current, null, 2));
}

run();
