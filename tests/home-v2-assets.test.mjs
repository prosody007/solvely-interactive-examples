import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const projectRoot = process.cwd();
const previewsRoot = join(projectRoot, "src/demos/previews");

function listPreviewFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) return listPreviewFiles(entryPath);
    if (entry.name.endsWith(".tsx")) return [entryPath];
    return [];
  });
}

function getReferencedFigmaAssets(source) {
  const referencedAssets = new Set();
  const directAssetPattern = /["'`](\/figma\/[^"'`$]+?\.(?:png|svg|jpg|jpeg|webp))["'`]/g;
  const assetBasePattern = /const\s+ASSET\s*=\s*["'`](\/figma\/[^"'`]+)["'`]/;
  const assetTemplatePattern = /`\$\{ASSET\}\/([^`$]+?\.(?:png|svg|jpg|jpeg|webp))`/g;
  const assetBase = source.match(assetBasePattern)?.[1];

  for (const match of source.matchAll(directAssetPattern)) {
    referencedAssets.add(match[1]);
  }

  if (assetBase) {
    for (const match of source.matchAll(assetTemplatePattern)) {
      referencedAssets.add(`${assetBase}/${match[1]}`);
    }
  }

  return referencedAssets;
}

test("static figma assets referenced by previews exist", () => {
  const previewFiles = listPreviewFiles(previewsRoot);
  const referencedAssets = new Set();

  for (const previewFile of previewFiles) {
    const source = readFileSync(previewFile, "utf8");
    for (const assetPath of getReferencedFigmaAssets(source)) {
      referencedAssets.add(assetPath);
    }
  }

  assert.ok(referencedAssets.size > 0, "expected previews to reference figma assets");

  for (const assetPath of referencedAssets) {
    assert.ok(
      existsSync(join(projectRoot, "public", assetPath)),
      `missing figma asset: ${assetPath}`,
    );
  }
});
