// script/baseStatus.js
// Global Garden "climate of becoming" loader.
// Reads meta/BASE_STATUS.yaml and exposes helpers.

import fs from "fs";
import path from "path";
import YAML from "yaml";
import { fileURLToPath } from "url";

// Resolve path relative to project root, not current working dir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATUS_PATH = path.join(__dirname, "..", "meta", "BASE_STATUS.yaml");

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

// --- Public API ---

// Return the whole BASE_STATUS document
export function getBaseStatus() {
  return loadRawBaseStatus();
}

// Active state resolution
// Prefer current_state → fallback to default_state → final fallback to "stillness"
export function getCurrentStateId() {
  const status = loadRawBaseStatus();
  return status.current_state || status.default_state || "stillness";
}

// Return full config block for current state
export function getCurrentStateConfig() {
  const status = loadRawBaseStatus();
  const id = getCurrentStateId();
  const state = status.states[id];

  if (!state) {
    throw new Error(`[baseStatus] No state config found for '${id}'`);
  }

  return { id, ...state };
}