import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const ROOT = process.cwd();
const PATH_FILE = path.join(ROOT, "gardenPath.yaml");
const SCENES_DIR = path.join(ROOT, "scenes");

function listSceneIds() {
  if (!fs.existsSync(SCENES_DIR)) return [];
  return fs
    .readdirSync(SCENES_DIR)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => path.basename(f, path.extname(f)));
}

function loadGardenPath() {
  if (!fs.existsSync(PATH_FILE)) {
    throw new Error(`Missing gardenPath.yaml at: ${PATH_FILE}`);
  }
  const raw = fs.readFileSync(PATH_FILE, "utf8");
  const doc = yaml.load(raw);
  return Array.isArray(doc) ? doc : doc?.stages ?? [];
}

function main() {
  const stages = loadGardenPath();
  const sceneIds = new Set(listSceneIds());

  const pathIds = [];
  const duplicates = new Map();

  for (const stage of stages) {
    const landmarks = stage?.landmarks ?? [];
    for (const id of landmarks) {
      pathIds.push(id);
      duplicates.set(id, (duplicates.get(id) ?? 0) + 1);
    }
  }

  const pathSet = new Set(pathIds);

  const missingScenes = pathIds.filter((id) => !sceneIds.has(id));
  const extraScenes = [...sceneIds].filter((id) => !pathSet.has(id));
  const dupes = [...duplicates.entries()].filter(([, n]) => n > 1);

  console.log("=== Garden Path Validation ===");
  console.log(`Stages: ${stages.length}`);
  console.log(`Landmarks listed in path: ${pathIds.length}`);
  console.log(`Scene files found in /scenes: ${sceneIds.size}`);
  console.log("");

  if (dupes.length) {
    console.log("Duplicates in gardenPath.yaml:");
    for (const [id, n] of dupes) console.log(`  - ${id} (x${n})`);
    console.log("");
  } else {
    console.log("No duplicates in gardenPath.yaml.\n");
  }

  if (missingScenes.length) {
    console.log("Landmarks in path with NO matching scene file:");
    for (const id of missingScenes) console.log(`  - ${id}`);
    console.log("");
  } else {
    console.log("All path landmarks have matching scene files.\n");
  }

  if (extraScenes.length) {
    console.log("Scene files in /scenes NOT referenced in gardenPath.yaml:");
    for (const id of extraScenes) console.log(`  - ${id}`);
    console.log("");
  } else {
    console.log("All scene files are referenced in gardenPath.yaml.\n");
  }
}

main();
