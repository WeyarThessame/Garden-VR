// script/readScene.js
import fs from "fs";
import yaml from "js-yaml";

// Import interaction stubs
import { initFountainOfReturning } from "./fountainOfReturning.js";
import { initSentinelStone } from "./sentinelStone.js";
import { createBridgeState, step, pause, halt, reset } from "./bridgeOfIncompleteStars.js";

// --- Config: pick one scene to test ---
const filePath = "./scenes/bridgeOfIncompleteStars.yaml"; // change to test other scenes

// Registry: interaction_script -> initializer/handlers
const interactionRegistry = {
  fountainOfReturning: (ctx) => initFountainOfReturning(ctx),
  sentinelStone: (ctx) => initSentinelStone(ctx),

  // Bridge of Incomplete Stars (uses stateful handlers)
  bridgeOfIncompleteStars: (ctx) => {
    console.log("→ Initializing Bridge of Incomplete Stars stub…");
    const state = createBridgeState();

    // For now, just expose handlers; later ctx.api will be real (renderer/audio)
    return {
      state,
      handlers: { step, pause, halt, reset },
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

    // Tiny proof-of-life test: call a handler if present
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
