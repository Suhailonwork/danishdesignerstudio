import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import sharp from "sharp";

/**
 * Studio-shot renderer.
 *
 * Produces JPEGs that read as styled garment photography: seamless backdrop,
 * directional light, shaded garment with folds, woven fabric texture, contact
 * shadow, film grain and a vignette. Used wherever a real product photograph
 * would go, so the storefront looks finished without pretending a stock photo
 * of a stranger is the shop's own product.
 */

const OUT = process.argv[2];
const PHOTOS = process.argv[3]; // directory of verified real photos (optional)

/* ------------------------------------------------------------------ */
/* Palettes                                                            */
/* ------------------------------------------------------------------ */

const P = {
  onyx:     { bg1: "#3a3a40", bg2: "#131316", cloth1: "#2b2b31", cloth2: "#0e0e12", lit: "#6d6d78", trim: "#c8a96a" },
  ink:      { bg1: "#363c44", bg2: "#12161b", cloth1: "#2a313a", cloth2: "#0f1318", lit: "#68727f", trim: "#cbb07d" },
  wine:     { bg1: "#4a2c35", bg2: "#1b0f14", cloth1: "#5d2030", cloth2: "#250c14", lit: "#8e4055", trim: "#d2a06e" },
  sand:     { bg1: "#e4d9c8", bg2: "#a9997f", cloth1: "#d9c8ac", cloth2: "#9c8763", lit: "#f0e7d8", trim: "#8a6a3b" },
  ivory:    { bg1: "#f1ece3", bg2: "#c3b9a8", cloth1: "#efe9dd", cloth2: "#bdb2a0", lit: "#ffffff", trim: "#a8874f" },
  moss:     { bg1: "#333c30", bg2: "#12160f", cloth1: "#26301f", cloth2: "#0d1108", lit: "#5c6b4e", trim: "#b39b6a" },
  midnight: { bg1: "#2b3547", bg2: "#0a0e16", cloth1: "#1b2740", cloth2: "#070b14", lit: "#4a5a7a", trim: "#b9a373" },
  clay:     { bg1: "#554032", bg2: "#1d130d", cloth1: "#6b4a30", cloth2: "#2a1a10", lit: "#9a6f4b", trim: "#cba97f" },
};

const hash = (s) => Math.abs([...String(s)].reduce((a, c) => (a * 33 + c.charCodeAt(0)) | 0, 5));

/* ------------------------------------------------------------------ */
/* Garment geometry                                                    */
/* ------------------------------------------------------------------ */

function garmentPath(w, h, kind, k) {
  const cx = w / 2;
  const top = h * (kind === "jacket" ? 0.17 : 0.15);
  const hem = h * (kind === "jacket" ? 0.68 : 0.84);
  const sh = w * (0.175 + (k % 3) * 0.01);
  const hip = w * (kind === "jacket" ? 0.205 : 0.2 + (k % 4) * 0.008);
  const neck = w * 0.048;

  return `M ${cx - neck} ${top}
    L ${cx - sh} ${top + h * 0.035}
    C ${cx - sh * 1.1} ${top + h * 0.19}, ${cx - hip * 1.02} ${hem - h * 0.26}, ${cx - hip} ${hem}
    L ${cx + hip} ${hem}
    C ${cx + hip * 1.02} ${hem - h * 0.26}, ${cx + sh * 1.1} ${top + h * 0.19}, ${cx + sh} ${top + h * 0.035}
    L ${cx + neck} ${top}
    C ${cx + neck * 0.42} ${top + h * 0.05}, ${cx - neck * 0.42} ${top + h * 0.05}, ${cx - neck} ${top} Z`;
}

function folds(w, h, kind, k) {
  const cx = w / 2;
  const top = h * (kind === "jacket" ? 0.17 : 0.15);
  const hem = h * (kind === "jacket" ? 0.68 : 0.84);
  const out = [];
  const lines = 7;
  for (let i = 0; i < lines; i += 1) {
    const t = (i + 1) / (lines + 1);
    const x = cx + (t - 0.5) * w * 0.36;
    const wobble = ((hash(`${k}${i}`) % 9) - 4) * (w * 0.004);
    const dark = i % 2 === 0;
    out.push(
      `<path d="M ${x + wobble} ${top + h * 0.09}
                C ${x - wobble * 2} ${top + (hem - top) * 0.4},
                  ${x + wobble * 2} ${top + (hem - top) * 0.7},
                  ${x + wobble} ${hem}"
             fill="none" stroke="${dark ? "#000" : "#fff"}"
             stroke-opacity="${dark ? 0.16 : 0.07}" stroke-width="${w * (dark ? 0.009 : 0.006)}"/>`
    );
  }
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Layers                                                              */
/* ------------------------------------------------------------------ */

function backdropSvg(w, h, p, k) {
  const floorY = h * 0.8;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="key" cx="0.46" cy="0.34" r="0.72">
        <stop offset="0" stop-color="${p.bg1}"/>
        <stop offset="1" stop-color="${p.bg2}"/>
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.22"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#key)"/>
    <rect y="${floorY}" width="${w}" height="${h - floorY}" fill="url(#floor)"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.3}" rx="${w * 0.42}" ry="${h * 0.3}"
             fill="${p.lit}" fill-opacity="0.07"/>
  </svg>`;
}

function shadowSvg(w, h, kind) {
  const hem = h * (kind === "jacket" ? 0.68 : 0.84);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <ellipse cx="${w * 0.5}" cy="${hem + h * 0.015}" rx="${w * 0.26}" ry="${h * 0.022}"
             fill="#000" fill-opacity="0.55"/>
  </svg>`;
}

function sleevePath(w, h, kind, k) {
  const cx = w / 2;
  const top = h * (kind === "jacket" ? 0.17 : 0.15);
  const sh = w * (0.175 + (k % 3) * 0.01);
  const cuffY = h * (kind === "jacket" ? 0.52 : 0.6);
  const outer = w * 0.085;
  const taper = w * 0.03;

  const arm = (dir) => `
    M ${cx + dir * sh} ${top + h * 0.03}
    C ${cx + dir * (sh + outer)} ${top + h * 0.09},
      ${cx + dir * (sh + outer)} ${cuffY - h * 0.14},
      ${cx + dir * (sh + outer - taper)} ${cuffY}
    L ${cx + dir * (sh - taper * 0.2)} ${cuffY - h * 0.01}
    C ${cx + dir * (sh + outer * 0.1)} ${cuffY - h * 0.16},
      ${cx + dir * (sh + outer * 0.2)} ${top + h * 0.12},
      ${cx + dir * sh} ${top + h * 0.03} Z`;

  return `${arm(-1)} ${arm(1)}`;
}

function garmentSvg(w, h, p, kind, k) {
  const path = garmentPath(w, h, kind, k);
  const sleeves = sleevePath(w, h, kind, k);
  const cx = w / 2;
  const top = h * (kind === "jacket" ? 0.17 : 0.15);
  const hem = h * (kind === "jacket" ? 0.68 : 0.84);

  const weave = [];
  const step = Math.max(5, Math.round(w / 150));
  for (let x = -h; x < w + h; x += step) {
    weave.push(
      `<line x1="${x}" y1="0" x2="${x + h}" y2="${h}" stroke="#fff" stroke-opacity="0.05" stroke-width="1"/>`
    );
  }

  const buttons = [];
  const count = kind === "jacket" ? 5 : 6;
  for (let i = 0; i < count; i += 1) {
    const y = top + h * 0.07 + i * ((hem - top) * 0.075);
    buttons.push(
      `<circle cx="${cx}" cy="${y}" r="${w * 0.0075}" fill="${p.trim}" fill-opacity="0.85"/>
       <circle cx="${cx}" cy="${y - w * 0.002}" r="${w * 0.003}" fill="#fff" fill-opacity="0.35"/>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="cloth" x1="0.15" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="${p.cloth1}"/>
        <stop offset="0.45" stop-color="${p.cloth1}"/>
        <stop offset="1" stop-color="${p.cloth2}"/>
      </linearGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0.16"/>
        <stop offset="0.25" stop-color="#fff" stop-opacity="0"/>
        <stop offset="0.82" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.3"/>
      </linearGradient>
      <clipPath id="clip"><path d="${path}"/></clipPath>
    </defs>

    <path d="${sleeves}" fill="url(#cloth)"/>
    <path d="${sleeves}" fill="#000" fill-opacity="0.16"/>
    <path d="${path}" fill="url(#cloth)"/>
    <g clip-path="url(#clip)">
      ${weave.join("")}
      ${folds(w, h, kind, k)}
      <rect width="${w}" height="${h}" fill="url(#rim)"/>
      <path d="M ${cx} ${top + h * 0.045} L ${cx} ${hem}"
            stroke="#000" stroke-opacity="0.28" stroke-width="${w * 0.006}" fill="none"/>
      <path d="M ${cx - w * 0.055} ${top + h * 0.02}
               C ${cx - w * 0.02} ${top + h * 0.055}, ${cx + w * 0.02} ${top + h * 0.055}, ${cx + w * 0.055} ${top + h * 0.02}"
            stroke="${p.trim}" stroke-opacity="0.5" stroke-width="${w * 0.005}" fill="none"/>
      ${buttons.join("")}
    </g>
    <path d="${path}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="${w * 0.0025}"/>
  </svg>`;
}

function vignetteSvg(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="v" cx="0.5" cy="0.45" r="0.78">
        <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.42"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#v)"/>
  </svg>`;
}

/* A woven-fabric macro plate, for "fabric" angles and editorial surfaces. */
function fabricSvg(w, h, p, k, motif = true) {
  const lines = [];
  const step = Math.max(4, Math.round(Math.min(w, h) / 120));
  for (let x = -h; x < w + h; x += step) {
    const o = (0.05 + ((k + x) % 5) * 0.012).toFixed(3);
    lines.push(`<line x1="${x}" y1="0" x2="${x + h}" y2="${h}" stroke="#fff" stroke-opacity="${o}" stroke-width="1.4"/>`);
  }
  for (let y = -w; y < h + w; y += step) {
    const o = (0.03 + ((k + y) % 4) * 0.01).toFixed(3);
    lines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y - w}" stroke="#000" stroke-opacity="${o}" stroke-width="1.4"/>`);
  }

  // A repeating zardozi-ish motif so the macro reads as embroidered cloth.
  const motifs = [];
  const gx = w / 4;
  const gy = h / 5;
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const x = gx * (i + 0.5);
      const y = gy * (j + 0.5) + (i % 2) * gy * 0.5;
      const r = Math.min(gx, gy) * 0.22;
      motifs.push(
        `<g transform="translate(${x} ${y}) rotate(45)" fill="none" stroke="${p.trim}" stroke-opacity="0.42" stroke-width="${r * 0.12}">
           <rect x="${-r * 0.5}" y="${-r * 0.5}" width="${r}" height="${r}"/>
           <rect x="${-r * 0.24}" y="${-r * 0.24}" width="${r * 0.48}" height="${r * 0.48}"/>
         </g>
         <circle cx="${x}" cy="${y}" r="${r * 0.1}" fill="${p.trim}" fill-opacity="0.55"/>`
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="f" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="${p.cloth1}"/>
        <stop offset="1" stop-color="${p.cloth2}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#f)"/>
    ${lines.join("")}
    ${motif ? motifs.join("") : ""}
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Compositor                                                          */
/* ------------------------------------------------------------------ */

/** SVG rasterisation can round differently per layer; force an exact size. */
async function raster(svg, W, H) {
  return sharp(Buffer.from(svg)).resize(W, H, { fit: "fill" }).png().toBuffer();
}

async function render({ w, h, palette, kind = "long", seed = "", mode = "garment", zoom = 1, motif = true }) {
  const p = P[palette] ?? P.onyx;
  const k = hash(`${palette}${kind}${seed}`);

  // Oversample then downscale: hides SVG edge aliasing, reads sharper.
  const W = Math.round(w * 1.35);
  const H = Math.round(h * 1.35);

  let baseBuf;
  if (mode === "fabric") {
    baseBuf = await raster(fabricSvg(W, H, p, k, motif), W, H);
  } else {
    const backdrop = await raster(backdropSvg(W, H, p, k), W, H);
    const shadow = await sharp(await raster(shadowSvg(W, H, kind), W, H))
      .blur(Math.max(8, W * 0.035))
      .png()
      .toBuffer();
    const garment = await raster(garmentSvg(W, H, p, kind, k), W, H);

    baseBuf = await sharp(backdrop)
      .composite([
        { input: shadow, blend: "over" },
        { input: garment, blend: "over" },
      ])
      .png()
      .toBuffer();
  }

  let img = sharp(baseBuf);

  if (zoom !== 1) {
    const zw = Math.round(W / zoom);
    const zh = Math.round(H / zoom);
    img = sharp(
      await img
        .extract({
          left: Math.round((W - zw) / 2),
          top: Math.round((H - zh) * 0.28),
          width: zw,
          height: zh,
        })
        .png()
        .toBuffer()
    );
  }

  // Film grain + vignette, then resize down to the target size.
  const grain = await sharp({
    create: { width: W, height: H, channels: 3, background: "#808080", noise: { type: "gaussian", mean: 128, sigma: 11 } },
  })
    .png()
    .toBuffer();

  const staged = await img.resize(W, H, { fit: "fill" }).png().toBuffer();

  // sharp runs resize BEFORE composite inside one pipeline, which would land a
  // full-size grain layer on an already-downscaled base. Two passes instead.
  const graded = await sharp(staged)
    .composite([
      { input: await sharp(grain).ensureAlpha(0.055).png().toBuffer(), blend: "overlay" },
      { input: await raster(vignetteSvg(W, H), W, H), blend: "over" },
    ])
    .png()
    .toBuffer();

  return sharp(graded)
    .resize(w, h, { fit: "fill", kernel: "lanczos3" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
}

async function write(name, buf) {
  const file = join(OUT, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buf);
}

/* ------------------------------------------------------------------ */
/* Asset map                                                           */
/* ------------------------------------------------------------------ */

const PRODUCTS = [
  ["noor-black-embroidered-kurta-set", "onyx", "long"],
  ["regal-essence-kurta-pajama", "ink", "long"],
  ["shaan-gold-thread-kurta", "clay", "long"],
  ["midnight-velvet-bandhgala", "midnight", "jacket"],
  ["ivory-pearl-sherwani", "ivory", "long"],
  ["royal-maroon-sherwani", "wine", "long"],
  ["obsidian-tiger-sherwani", "onyx", "long"],
  ["heritage-open-jodhpuri", "sand", "jacket"],
  ["emerald-silk-jodhpuri", "moss", "jacket"],
  ["classic-black-bandhgala-suit", "onyx", "jacket"],
  ["ivory-floral-indo-western", "ivory", "long"],
  ["cobalt-raw-silk-nehru-set", "midnight", "jacket"],
  ["champagne-zardozi-sherwani", "sand", "long"],
  ["onyx-mirror-work-kurta", "ink", "long"],
  ["saffron-festive-kurta-set", "clay", "long"],
  ["charcoal-textured-bandhgala", "ink", "jacket"],
  ["pearl-white-groom-sherwani", "ivory", "long"],
  ["wine-velvet-jodhpuri-set", "wine", "jacket"],
  ["sage-linen-kurta-pajama", "moss", "long"],
  ["imperial-blue-bandhgala", "midnight", "jacket"],
  ["antique-gold-sherwani", "sand", "long"],
  ["noir-sequin-indo-western", "onyx", "long"],
  ["ivory-chikankari-kurta", "ivory", "long"],
  ["rust-brocade-nehru-jacket", "clay", "jacket"],
];

const V = process.argv[4] ?? "v3";
const ext = `.${V}.jpg`;
let count = 0;

for (const [slug, palette, kind] of PRODUCTS) {
  // 1 full, 2 closer, 3 fabric macro, 4 full again with a different seed.
  const angles = [
    { mode: "garment", zoom: 1, seed: `${slug}1` },
    { mode: "garment", zoom: 1.9, seed: `${slug}2` },
    { mode: "fabric", zoom: 1, seed: `${slug}3` },
    { mode: "garment", zoom: 1.25, seed: `${slug}4` },
  ];
  for (let i = 0; i < angles.length; i += 1) {
    await write(
      `products/${slug}-${i + 1}${ext}`,
      await render({ w: 900, h: 1200, palette, kind, ...angles[i] })
    );
    count += 1;
  }
  process.stdout.write(`\rproducts ${count}/96`);
}
console.log();

const CATEGORIES = [
  ["kurta-pajama", "clay", "long"],
  ["sherwani", "ivory", "long"],
  ["bandhgala", "midnight", "jacket"],
  ["jodhpuri", "sand", "jacket"],
  ["indo-western", "onyx", "long"],
  ["nehru-jackets", "moss", "jacket"],
];
for (const [slug, palette, kind] of CATEGORIES) {
  await write(`categories/${slug}${ext}`, await render({ w: 900, h: 1100, palette, kind, seed: slug }));
}
console.log("categories done");

const COLLECTIONS = [
  ["wedding-collection", "ivory"],
  ["groom-collection", "onyx"],
  ["festive-collection", "clay"],
  ["eid-collection", "moss"],
  ["new-collection", "midnight"],
  ["reception-collection", "wine"],
];
for (const [slug, palette] of COLLECTIONS) {
  await write(`collections/${slug}${ext}`, await render({ w: 1600, h: 900, palette, mode: "fabric", seed: slug }));
  await write(`collections/${slug}-thumb${ext}`, await render({ w: 1000, h: 1000, palette, kind: "long", seed: `${slug}t` }));
}
console.log("collections done");

const IG = ["onyx", "sand", "ivory", "midnight", "clay", "moss"];
for (let i = 0; i < IG.length; i += 1) {
  await write(
    `instagram/ig-${i + 1}${ext}`,
    await render({
      w: 1000, h: 1000, palette: IG[i],
      kind: i % 2 ? "jacket" : "long",
      mode: i % 3 === 2 ? "fabric" : "garment",
      seed: `ig${i}`,
    })
  );
}
console.log("instagram done");

for (const [name, palette] of [
  ["arjun", "onyx"], ["vikram", "ink"], ["imran", "clay"],
  ["rahul", "midnight"], ["zaid", "moss"], ["kabir", "sand"],
]) {
  await write(`avatars/${name}${ext}`, await render({ w: 300, h: 300, palette, mode: "fabric", motif: false, seed: name }));
}
console.log("avatars done");

/* ---- banners & blog: real photography where it was verified usable ---- */

const photoMap = PHOTOS && existsSync(join(PHOTOS, "downloaded.json"))
  ? JSON.parse(readFileSync(join(PHOTOS, "downloaded.json"), "utf8"))
  : [];
const byIndex = new Map(photoMap.map((p) => [p.index, p]));

async function fromPhoto(index, w, h, name, position = "attention") {
  const item = byIndex.get(index);
  if (!item) return false;
  const buf = await sharp(item.file)
    .resize(w, h, { fit: "cover", position })
    .modulate({ saturation: 0.92 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  await write(name, buf);
  return true;
}

// index -> slot. Only photos reviewed and judged usable are mapped.
const PHOTO_SLOTS = [
  // [sourceIndex, width, height, outputName, cropPosition]
  [8, 1400, 1600, `banners/hero-primary${ext}`],
  [0, 1200, 800, `banners/hero-kurta${ext}`],
  [6, 1200, 800, `banners/hero-bandhgala${ext}`],
  [3, 900, 1100, `banners/inspiration-1${ext}`],
  [20, 900, 1100, `banners/inspiration-2${ext}`],
  [16, 900, 1100, `banners/inspiration-3${ext}`],
  // #84 carries a photographer watermark low-right; crop from the top.
  [84, 1200, 1000, `banners/editorial-vogue${ext}`, "top"],
  [84, 900, 1100, `banners/editorial-couple${ext}`, "top"],
  [3, 1800, 700, `banners/new-arrivals-strip${ext}`],
  [79, 1800, 1000, `banners/testimonial-bg${ext}`],
  [0, 1400, 900, `banners/about-hero${ext}`],
  [16, 900, 1100, `banners/about-secondary${ext}`],
  [6, 1400, 800, `banners/contact${ext}`],
  [8, 1200, 630, `banners/og-default${ext}`],
  [3, 1600, 900, `blog/sherwani-guide${ext}`],
  [20, 1600, 900, `blog/kurta-fabric-guide${ext}`],
  [0, 1600, 900, `blog/wedding-colour-palette${ext}`],
  [8, 1600, 900, `blog/bandhgala-styling${ext}`],
  [6, 1600, 900, `blog/eid-lookbook${ext}`],
  [16, 1600, 900, `blog/measurement-guide${ext}`],
];

const FALLBACK = { palette: "onyx", mode: "fabric" };
for (const [index, w, h, name, position] of PHOTO_SLOTS) {
  const ok = await fromPhoto(index, w, h, name, position ?? "attention");
  if (!ok) {
    await write(name, await render({ w, h, ...FALLBACK, seed: name }));
    console.log("fallback render for", name);
  }
}
console.log("banners + blog done");

/* ---- attribution ---- */
const used = [...new Set(PHOTO_SLOTS.map(([i]) => i))]
  .map((i) => byIndex.get(i))
  .filter(Boolean);

writeFileSync(
  join(OUT, "PHOTO-CREDITS.md"),
  `# Photo credits\n\n` +
    `Placeholder photography used on banners and blog covers.\n` +
    `Sourced from Wikimedia Commons. **Replace these with your own product\n` +
    `photography before going live** — see the note in README.\n\n` +
    used
      .map(
        (p) =>
          `- **${p.title}** — ${p.artist} — ${p.licence}\n  ${p.descriptionUrl}`
      )
      .join("\n") +
    `\n\nEverything under \`products/\`, \`categories/\`, \`collections/\`,\n` +
    `\`instagram/\` and \`avatars/\` is rendered artwork generated by\n` +
    `\`.photo-tools/studio.mjs\`, not photography.\n`,
  "utf8"
);

console.log("\nwrote PHOTO-CREDITS.md");
