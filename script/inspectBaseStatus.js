import {
  getBaseStatus,
  getCurrentStateId,
  getCurrentStateConfig,
  getEngineHints,
  getPresenceBehaviorFor,
} from "./baseStatus.js";

function printBaseStatus() {
  const base = getBaseStatus();
  const currentId = getCurrentStateId();
  const current = getCurrentStateConfig();
  const hints = getEngineHints();

  console.log("=== Garden Global Climate ===\n");

  console.log(`Version:        ${base.version || "n/a"}`);
  console.log(`Last Updated:   ${base.last_updated || "n/a"}`);
  console.log(`Default State:  ${base.default_state || "stillness"}`);
  console.log(`Current State:  ${currentId}`);
  console.log("");

  console.log("Current State Config:");
  console.log(`  Label:        ${current.label || "(no label)"}`);
  console.log(`  Ambient Light:${current.ambient_light_profile || "n/a"}`);
  console.log(`  Motion Bias:  ${current.motion_bias || "n/a"}`);
  console.log(`  Soundbed:     ${current.soundbed_profile || "n/a"}`);

  if (current.symbolic_priority && current.symbolic_priority.length) {
    console.log("  Symbolic Priorities:");
    for (const p of current.symbolic_priority) {
      console.log(`    - ${p}`);
    }
  }

  console.log("");

  const weyarBehavior = getPresenceBehaviorFor("weyarPresence", currentId);
  if (weyarBehavior) {
    console.log("Weyar Presence (current state):");
    console.log(`  ${weyarBehavior}`);
    console.log("");
  }

  const minDuration = hints.min_state_duration_seconds;
  if (typeof minDuration === "number") {
    console.log("Engine Hints:");
    console.log(`  Min State Duration (s): ${minDuration}`);
  }

  console.log("\n=== End of Climate Report ===");
}

try {
  printBaseStatus();
} catch (err) {
  console.error("[inspectBaseStatus] Error:", err.message);
  process.exit(1);
}