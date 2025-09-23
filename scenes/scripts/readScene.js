// scripts/readScene.js
import fs from "fs";
import yaml from "js-yaml";

// pick one scene to test
const filePath = "./scenes/sentinelStone.yaml";

try {
  // read file contents
  const file = fs.readFileSync(filePath, "utf8");

  // parse YAML
  const data = yaml.load(file);

  // log fields
  console.log("Scene:", data.scene);
  console.log("Concept:", data.concept.trim());
  console.log("Purpose:", data.purpose.trim());
} catch (e) {
  console.error("Error reading YAML:", e);
}
