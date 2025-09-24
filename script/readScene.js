// script/readScene.js
import fs from "fs";
import yaml from "js-yaml";

// Import interaction stubs
import { initFountainOfReturning } from "./fountainOfReturning.js";
import { initSentinelStone } from "./sentinelStone.js"; // example, if defined

// --- Config: pick one scene to test ---
const filePath = "./scenes/fountainOfReturning.yaml"; // change path to test other scenes

try {
  // read file contents
  const file = fs.readFileSync(filePath, "utf8");

  // parse YAML
  const data = yaml.load(file);

  // log fields
  console.log("Scene:", data.Scene || data.scene);
  console.log("Concept:", (data.Concept || data.concept || "").trim());
  console.log("Purpose:", (data.Purpose || data.purpose || "").trim());

  // initialize JS stub if available
  switch (data.Scene || data.scene) {
    case "Fountain of Returning":
      console.log("→ Initializing Fountain of Returning stub…");
      initFountainOfReturning({}); // placeholder: pass in scene/renderer later
      break;

    case "Sentinel Stone":
      console.log("→ Initializing Sentinel Stone stub…");
      initSentinelStone({});
      break;

    default:
      console.log("No interaction stub defined for this scene yet.");
  }
} catch (e) {
  console.error("Error reading YAML:", e);
}
