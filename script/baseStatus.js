// script/baseStatus.js
// Global Garden "climate of becoming" loader.
// Reads meta/BASE_STATUS.yaml and exposes helpers.

import fs from "fs";
import path from "path";
import YAML from "yaml"; // or 'js-yaml' if that's what your project uses

const STATUS_PATH = path.join("meta", "BASE_STATUS.yaml");

let cached = null;

function loadRawBaseStatus() {
  if (cached) return cached;

  const raw = fs.readFileSync(STATUS_PATH, "utf-8");
  const doc = YAML.parse(raw);

  if (!doc || !doc.states) {
    throw new Error("[baseStatus] Invalid BASE_STATUS.yaml: no states defined");
  }

  cached = doc;
  return cached;
}

// Return the whole BASE_STATUS document
export function getBaseStatus() {
  return loadRawBaseStatus();
}

// For now, current state = default_state (later we can change it)
export function getCurrentStateId() {
  const status = loadRawBaseStatus();
  return status.current_state || status.default_state || "stillness";
}

// Return the object for the active state
export function getCurrentStateConfig() {
  const status = loadRawBaseStatus();
  const id = getCurrentStateId();
  const state = status.states[id];

  if (!state) {
    throw new Error(`[baseStatus] No state config found for '${id}'`);
  }

  return { id, ...state };
}
