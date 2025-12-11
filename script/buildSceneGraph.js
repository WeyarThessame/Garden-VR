/**
 * buildSceneGraph.js
 *
 * Creates an in-memory graph of Garden scenes based on index.yaml.
 * This prepares the world for future navigation, visualization,
 * and VR engine integration.
 */

import fs from "fs";
import yaml from "js-yaml";

export function buildSceneGraph() {
  const indexPath = "./scenes/index.yaml";

  try {
    const file = fs.readFileSync(indexPath, "utf8");
    const index = yaml.load(file);

    const graph = {};

    // Build nodes
    for (const scene of index.scenes) {
      graph[scene.id] = {
        name: scene.name,
        category: scene.category,
        file: scene.file,
        related_to: scene.related_to || [],
      };
    }

    return graph;

  } catch (err) {
    console.error("Error building scene graph:", err);
    return null;
  }
}

// Temporary test output (safe to remove later)
console.log(JSON.stringify(buildSceneGraph(), null, 2));

