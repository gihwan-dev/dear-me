import sharp from 'sharp';

async function debugBFS(file) {
  const resized = await sharp(file)
    .resize(256, 256, { fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .toBuffer();
  const { data, info } = await sharp(resized).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const distTo = (i, r, g, b) => Math.sqrt(
    Math.pow(data[i]-r,2) + Math.pow(data[i+1]-g,2) + Math.pow(data[i+2]-b,2)
  );
  const neighbors = (idx) => {
    const x = idx % width, y = Math.floor(idx / width), r = [];
    if (x > 0) r.push(idx - 1);
    if (x < width - 1) r.push(idx + 1);
    if (y > 0) r.push(idx - width);
    if (y < height - 1) r.push(idx + width);
    return r;
  };

  const isBg = new Uint8Array(width * height);
  const queue = [];
  const corners = [[0,0],[width-1,0],[0,height-1],[width-1,height-1]];
  for (const [cx, cy] of corners) {
    const idx = cy * width + cx;
    if (!isBg[idx]) { isBg[idx] = 1; queue.push(idx); }
  }

  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    const pi = cur * 4;
    const curR = data[pi], curG = data[pi+1], curB = data[pi+2];
    for (const nb of neighbors(cur)) {
      if (isBg[nb]) continue;
      if (distTo(nb * 4, curR, curG, curB) <= 20) {
        isBg[nb] = 1;
        queue.push(nb);
      }
    }
  }

  const bgCount = isBg.reduce((s, v) => s + v, 0);
  const total = width * height;
  console.log(file.split('/').pop(), '→ BFS marked', bgCount, '/', total, 'pixels (' + (bgCount/total*100).toFixed(1) + '%)');

  // Find max neighbor distance encountered
  let maxDist = 0, stopCount = 0;
  for (let i = 0; i < total; i++) {
    if (!isBg[i]) continue;
    const pi = i * 4;
    const x = i % width, y = Math.floor(i / width);
    const nbs = [];
    if (x < width-1) nbs.push(i+1);
    if (y < height-1) nbs.push(i+width);
    for (const nb of nbs) {
      const d = distTo(nb * 4, data[pi], data[pi+1], data[pi+2]);
      if (d > maxDist) maxDist = d;
      if (d > 20 && !isBg[nb]) stopCount++;
    }
  }
  console.log('  max neighbor dist from bg pixels:', maxDist.toFixed(1), '| BFS stopped', stopCount, 'times at boundary');
  // Sample top row
  console.log('  Top row (x=0..9):');
  for (let x = 0; x < 10; x++) {
    const pi = x * 4;
    const prevPi = Math.max(0, x-1) * 4;
    const d = x > 0 ? distTo(pi, data[prevPi], data[prevPi+1], data[prevPi+2]) : 0;
    console.log('   px(' + x + '): [' + data[pi] + ',' + data[pi+1] + ',' + data[pi+2] + '] dist_from_left=' + d.toFixed(1) + ' isBg=' + isBg[x]);
  }
}

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

debugBFS('public/images/decorations/hourglass.png');
debugBFS('public/images/decorations/wax-seal.png');
