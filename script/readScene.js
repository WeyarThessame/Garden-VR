// script/readScene.js
// Purpose: Load a scene YAML, attach its interaction stub, and run a tiny proof-of-life test.

import fs from "fs";
import yaml from "js-yaml";

// ---- Import interaction stubs (TEST HARNESS ONLY) ----
import { createBridgeState, step, pause, halt, reset } from "./bridgeOfIncompleteStars.js";

// --- Config: pick one scene to test ---
const filePath = "./scenes/bridgeOfIncompleteStars.yaml"; // change to test other scenes

// Registry: interaction_script -> initializer/handlers
// This is a SIMPLE LOOKUP TABLE.
// The string in YAML must match a key here.
const interactionRegistry = {
  bridgeOfIncompleteStars: (ctx) => {
    console.log("→ Initializing Bridge of Incomplete Stars stub…");

    const state = createBridgeState();

    return {
      state,
      handlers: {
        step,
        pause,
        halt,
        reset,
      },
    };
  },
};

try {
  const file = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(file) || {};

  const id = data.id;
  const sceneName = data.scene || data.Scene;
  const concept = (data.concept || data.Concept || "").trim();
  const purpose = (data.purpose || data.Purpose || "").trim();
  const interactionScript = data.interaction_script || null;

  console.log("ID:", id);
  console.log("Scene:", sceneName);
  if (concept) console.log("Concept:", concept);
  if (purpose) console.log("Purpose:", purpose);

  if (interactionScript && interactionRegistry[interactionScript]) {
    const result = interactionRegistry[interactionScript]({ scene: data });
    console.log("Interaction attached:", interactionScript);

    // ---- Proof-of-life test ----
    if (result?.handlers?.step) {
      console.log("→ Running one 'step' to prove the stub is wired…");
      result.handlers.step(result.state, {
        addFragment: (i) => console.log(`addFragment(${i})`),
        playSound: (name) => console.log(`playSound(${name})`),
      });
    }
  } else {
    console.log("No interaction stub attached (or unknown interaction_script).");
  }
} catch (e) {
  console.error("Error reading YAML:", e);
}