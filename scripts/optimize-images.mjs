import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { existsSync, statSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const IMAGES_DIR = join(ROOT, 'public/images');
const OUTPUT_DIR = join(ROOT, 'public/images/optimized');
const DECORATIONS_DIR = join(IMAGES_DIR, 'decorations');
const DECORATIONS_OUTPUT = join(OUTPUT_DIR, 'decorations');

/** @type {Record<string, { width: number; quality: number; removeBg?: boolean }>} */
const CONFIG = {
  logo: { width: 512, quality: 85, removeBg: true },
  hero: { width: 1280, quality: 80, removeBg: true },
};

const DECORATION_CONFIG = { width: 256, quality: 80, removeBg: true };

/**
 * Remove white/cream background from a PNG image.
 *
 * Strategy:
 *  1. Sample corner pixels to detect the dominant background color.
 *  2. Flood-fill from all 4 corners (BFS) to find connected background pixels.
 *  3. For every pixel tagged as background, scale alpha by how far its color
 *     is from the background — pixels very close become fully transparent,
 *     pixels at the edge of the tolerance zone stay semi-transparent (soft edge).
 *
 * @param {Buffer} inputBuffer - Raw PNG/image buffer
 * @param {Object} opts
 * @param {number} opts.tolerance   - Max color-distance for flood-fill seed (default 35)
 * @param {number} opts.feather     - Extra distance band for soft edges (default 20)
 * @returns {Promise<Buffer>} RGBA raw buffer
 */
/**
 * Remove background from an image using saturation-based detection.
 *
 * Background pixels are ACHROMATIC (R≈G≈B, low saturation) — this is true
 * regardless of the shade, which handles checkerboard-style transparency
 * previews saved as gray pixels (both light and dark variants).
 *
 * Strategy:
 *  1. Mark all low-saturation pixels as background candidates.
 *  2. BFS flood-fill from corners: expand only through connected achromatic pixels
 *     so isolated gray areas WITHIN the illustration are preserved.
 *  3. Apply alpha=0 to all confirmed background pixels, with soft feathering at edges.
 *
 * @param {Buffer} inputBuffer
 * @param {Object} opts
 * @param {number} opts.satThreshold   max(R,G,B) - min(R,G,B) to be "achromatic" (default 18)
 * @param {number} opts.featherPx      feather width in pixels (default 2)
 */
async function removeBgFromBuffer(inputBuffer, { satThreshold = 18, featherPx = 2 } = {}) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;

  // Saturation = max(R,G,B) - min(R,G,B). Low = gray/achromatic.
  const saturation = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return Math.max(r, g, b) - Math.min(r, g, b);
  };

  const isAchromatic = (i) => saturation(i) <= satThreshold;

  const neighbors4 = (idx) => {
    const x = idx % width, y = Math.floor(idx / width);
    const r = [];
    if (x > 0)          r.push(idx - 1);
    if (x < width - 1)  r.push(idx + 1);
    if (y > 0)          r.push(idx - width);
    if (y < height - 1) r.push(idx + width);
    return r;
  };

  // BFS from corners, expanding through achromatic pixels only
  const isBg = new Uint8Array(width * height);
  const queue = [];

  const corners = [
    [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
  ];
  for (const [cx, cy] of corners) {
    const idx = cy * width + cx;
    if (!isBg[idx] && isAchromatic(idx * 4)) {
      isBg[idx] = 1;
      queue.push(idx);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const nb of neighbors4(cur)) {
      if (isBg[nb]) continue;
      if (isAchromatic(nb * 4)) {
        isBg[nb] = 1;
        queue.push(nb);
      }
    }
  }

  // Apply alpha, with simple pixel-distance feathering
  const out = Buffer.from(data);

  for (let i = 0; i < width * height; i++) {
    const pi = i * 4;

    if (isBg[i]) {
      out[pi + 3] = 0;
      continue;
    }

    // For foreground pixels adjacent to background, apply soft edge
    if (featherPx > 0) {
      let minBgSteps = Infinity;
      // BFS up to featherPx distance to find nearest background pixel
      const visited = new Set([i]);
      let frontier = [i];
      for (let step = 1; step <= featherPx && minBgSteps === Infinity; step++) {
        const next = [];
        for (const cur of frontier) {
          for (const nb of neighbors4(cur)) {
            if (visited.has(nb)) continue;
            visited.add(nb);
            if (isBg[nb]) { minBgSteps = step; break; }
            next.push(nb);
          }
          if (minBgSteps !== Infinity) break;
        }
        frontier = next;
      }

      if (minBgSteps <= featherPx) {
        const t = minBgSteps / (featherPx + 1);
        out[pi + 3] = Math.round(t * data[pi + 3]);
      }
    }
  }

  return out;
}

async function optimizeFile(inputPath, outputPath, { width, height, quality, removeBg }) {
  const { name } = parse(inputPath);
  const outFile = join(outputPath, `${name}.webp`);

  // Step 1: resize first
  const resized = await sharp(inputPath)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .toBuffer();

  let finalBuffer;

  if (removeBg) {
    // Step 2: get metadata of resized image
    const meta = await sharp(resized).metadata();
    // Step 3: remove background
    const rawOut = await removeBgFromBuffer(resized, { tolerance: 35, feather: 20 });
    // Step 4: convert raw RGBA → WebP
    await sharp(rawOut, { raw: { width: meta.width, height: meta.height, channels: 4 } })
      .webp({ quality, alphaQuality: 95 })
      .toFile(outFile);
  } else {
    await sharp(resized)
      .webp({ quality, alphaQuality: 90 })
      .toFile(outFile);
  }

  const inputMeta = await sharp(inputPath).metadata();
  const outputMeta = await sharp(outFile).metadata();
  const inputSize = statSync(inputPath).size;
  const outputSize = statSync(outFile).size;

  console.log(
    `  ${name}.png (${inputMeta.width}x${inputMeta.height}, ${(inputSize / 1024).toFixed(0)}KB)` +
    ` -> ${name}.webp (${outputMeta.width}x${outputMeta.height}, ${(outputSize / 1024).toFixed(0)}KB)` +
    ` [${((1 - outputSize / inputSize) * 100).toFixed(1)}% smaller]${removeBg ? ' ✓ bg removed' : ''}`
  );
}

async function main() {
  console.log('Optimizing images...\n');

  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(DECORATIONS_OUTPUT, { recursive: true });

  console.log('Main images:');
  for (const [name, config] of Object.entries(CONFIG)) {
    const inputPath = join(IMAGES_DIR, `${name}.png`);
    if (existsSync(inputPath)) {
      await optimizeFile(inputPath, OUTPUT_DIR, config);
    } else {
      console.log(`  Skipping ${name}.png (not found)`);
    }
  }

  console.log('\nDecorations:');
  if (existsSync(DECORATIONS_DIR)) {
    const files = await readdir(DECORATIONS_DIR);
    const pngFiles = files.filter((f) => f.endsWith('.png'));
    for (const file of pngFiles) {
      await optimizeFile(join(DECORATIONS_DIR, file), DECORATIONS_OUTPUT, DECORATION_CONFIG);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
