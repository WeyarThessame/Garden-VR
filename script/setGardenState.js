// script/setGardenState.js
// CLI tool to change the Garden's global "current_state"
// defined in meta/BASE_STATUS.yaml.
//
// Usage:
//   node script/setGardenState.js becoming
//   node script/setGardenState.js stillness
//
// It will:
//   - load BASE_STATUS.yaml
//   - verify the requested state exists in `states`
//   - update current_state
//   - write the file back to disk

import fs from "fs";
import path from "path";
import YAML from "yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATUS_PATH = path.join(__dirname, "..", "meta", "BASE_STATUS.yaml");

function loadBaseStatus() {
  const raw = fs.readFileSync(STATUS_PATH, "utf-8");
  const doc = YAML.parse(raw);

  if (!doc || !doc.states) {
    throw new Error("[setGardenState] Invalid BASE_STATUS.yaml: no states defined");
  }

  return { doc };
}

function saveBaseStatus(doc) {
  const yamlOut = YAML.stringify(doc);
  fs.writeFileSync(STATUS_PATH, yamlOut, "utf-8");
}

function main() {
  const requestedState = process.argv[2];

  if (!requestedState) {
    console.error("Usage: node script/setGardenState.js <stateId>");
    process.exit(1);
  }

  const { doc } = loadBaseStatus();
  const availableStates = Object.keys(doc.states || {});

  if (!availableStates.includes(requestedState)) {
    console.error("[setGardenState] Unknown state:", requestedState);
    console.error("Available states:");
    for (const s of availableStates) {
      console.error("  -", s);
    }
    process.exit(1);
  }

  const prev = doc.current_state || doc.default_state || "stillness";
  doc.current_state = requestedState;

  saveBaseStatus(doc);

  console.log("=== Garden State Updated ===");
  console.log("Previous state:", prev);
  console.log("New state:     ", requestedState);
}

try {
  main();
} catch (err) {
  console.error("[setGardenState] Error:", err.message);
  process.exit(1);
}
