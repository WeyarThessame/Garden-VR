// scripts/readGardenPath.js
import fs from "fs";
import yaml from "js-yaml";

try {
  const file = fs.readFileSync("gardenPath.yaml", "utf8");
  const data = yaml.load(file);

  console.log("Garden Path:");
  data.forEach(stage => {
    console.log(`\nStage: ${stage.stage}`);
    stage.landmarks.forEach(l => console.log(`  - ${l}`));
  });
} catch (e) {
  console.error("Error reading gardenPath.yaml:", e);
}
