// script/baseStatus.js
// Global Garden "climate of becoming" loader.
// Reads meta/BASE_STATUS.yaml and exposes helpers for the engine.

import fs from "fs";
import path from "path";
import YAML from "yaml"; // or `js-yaml` if that's what you're already using

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

/**
 * getBaseStatus()
 * Returns the entire parsed BASE_STATUS document.
 */
export function getBaseStatus() {
  return loadRawBaseStatus();
}

/**
 * getCurrentStateId()
 * For now this is just `default_state`. Later it can be dynamic.
 */
export function getCurrentStateId() {
  const status = loadRawBaseStatus();
  return status.current_state || status.default_state || "stillness";
}

/**
 * getCurrentStateConfig()
 * Returns the full object for the active state: ambient_light_profile, motion_bias, etc.
 */
export function getCurrentStateConfig() {
  const status = loadRawBaseStatus();
  const id = getCurrentStateId();
  const state = status.states[id];

  if (!state) {
    throw new Error(`[baseStatus] No state config found for '${id}'`);
  }

  return { id, ...state };
}

/**
 * projectStateOntoScene(scene)
 * Pure function: returns a new scene object with baseStatus attached.
 * Does NOT mutate the original scene object.
 */
export function projectStateOntoScene(scene) {
  const baseState = getCurrentStateConfig();

  return {
    ...scene,
    baseStatus: {
      id: baseState.id,
      ambient_light_profile: baseState.ambient_light_profile,
      motion_bias: baseState.motion_bias,
      soundbed_profile: baseState.soundbed_profile,
      symbolic_priority: baseState.symbolic_priority,
    }
  };
}
