// Ring Tower from the open-source 23rd.dev registry
// (https://23rd.dev/docs/components/ring-tower), as published apart from
// formatting, two typing fixes for this project's stricter TypeScript, and
// AAK's additions marked (AAK): onHover and onPick report which photo is
// under the pointer or was clicked, so the media archive can link to albums.
// Used on the media archive (/media).

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type Texture,
} from "three";

export type RingTowerTheme = "light" | "dark" | "auto";

/** One ring's own settings. Anything left out follows the tower. */
export type RingTowerRing = {
  /** Images for this ring alone. Default: the tower's `images`. */
  images?: string[];
  /**
   * Which way the ring leans, in degrees around the tower. Default `i * 90`,
   * a quarter turn from the ring below, so the stack zig-zags.
   */
  rotation?: number;
  /** How far the ring leans, in degrees, -45 to 45. Default `14`. */
  tilt?: number;
  /**
   * Degrees per second the ring turns around the tower, -180 to 180, so its
   * lean sweeps round. Default `0`.
   */
  spin?: number;
  /**
   * Crawl speed for this ring, -4 to 4; negative crawls the other way.
   * Default: the tower's `speed`.
   */
  speed?: number;
  /**
   * Degrees the pointer turns this ring, -90 to 90; the sign picks the
   * direction. Default: the tower's `parallax`, alternating direction.
   */
  parallax?: number;
};

export type RingTowerOptions = {
  /**
   * Image URLs drawn side by side around every band. Cross-origin images
   * need CORS headers. Empty draws a plain grid band.
   */
  images?: string[] | undefined;
  /**
   * Number of stacked rings, 1 to 5. Default `5`. Or one settings object per
   * ring, from the bottom up, to set each ring's rotation, tilt, spin,
   * speed, parallax or images; the array's length is the count.
   */
  rings?: number | RingTowerRing[];
  /** How fast the images crawl around the bands. Default `1`, 0 to 4. */
  speed?: number;
  /** Drag a band to spin the tower, with inertia. Default `true`. */
  draggable?: boolean;
  /**
   * How far, in degrees, the pointer turns each band. Neighbors turn the
   * opposite way. Default `24`, 0 to 90. `0` keeps every band in step.
   */
  parallax?: number;
  /**
   * How far the inside of the bands fades toward the page, 0 to 1: black in
   * dark mode, white in light mode. Default `0.86`.
   */
  backface?: number;
  /** `"auto"` follows the page. Default `"auto"`. */
  theme?: RingTowerTheme;
  /** (AAK) The photo under the pointer as it moves, `null` off the photos. */
  onHover?: ((hit: RingTowerHit | null) => void) | undefined;
  /** (AAK) A photo was clicked or tapped, not dragged. */
  onPick?: ((hit: RingTowerHit) => void) | undefined;
};

/** (AAK) A photo on the rings: its URL, its ring, and where the pointer is. */
export type RingTowerHit = { url: string; ring: number; clientX: number; clientY: number };

export type RingTowerInstance = {
  setOptions: (options: Partial<RingTowerOptions>) => void;
  destroy: () => void;
};

export const DEFAULT_RINGS = 5;
export const MAX_RINGS = 5;
export const DEFAULT_SPEED = 1;
export const DEFAULT_PARALLAX = 24;
export const DEFAULT_BACKFACE = 0.86;
export const DEFAULT_TILT = 14;
export const DEFAULT_SPIN = 0;

const RADIUS = 4;
const BAND_HEIGHT = 2;
const SPACING = 3.5;
const SEGMENTS = 100;
const STRIP_HEIGHT = 512;
const CRAWL = 0.012;
const START_ANGLE = 0.5;
const DEG = Math.PI / 180;
/** Lean cycle per ring; signs alternate so neighbors counter-turn. */
const PARALLAX_FACTORS = [1, -0.75, 1.25, -0.9];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function numberOr(value: unknown, fallback: number, min: number, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return clamp(value, min, max);
}

/** Default rotation for ring `i`: a quarter turn from the one below. */
export function defaultRotation(i: number) {
  return (i * 90) % 360;
}

/** Default parallax for ring `i`: neighbors turn opposite ways. */
export function defaultParallax(i: number, parallax = DEFAULT_PARALLAX) {
  return parallax * PARALLAX_FACTORS[i % PARALLAX_FACTORS.length]!;
}

/** The ring count and each ring's own settings (empty where unset). */
function ringsOf(value: RingTowerOptions["rings"]): RingTowerRing[] {
  if (Array.isArray(value) && value.length > 0) {
    return value.slice(0, MAX_RINGS).map((ring) => (ring && typeof ring === "object" ? ring : {}));
  }
  const count = Math.round(
    numberOr(Array.isArray(value) ? undefined : value, DEFAULT_RINGS, 1, MAX_RINGS),
  );
  return Array.from({ length: count }, () => ({}));
}

function urlsOf(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images.filter((url): url is string => typeof url === "string" && url.length > 0);
}

/** Resolves shadcn / next-themes dark mode (`attribute="class"` → `html.dark`). */
export function isDarkTheme(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  const dataTheme = root.getAttribute("data-theme");
  if (dataTheme === "dark") return true;
  if (dataTheme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveDark(theme: RingTowerTheme): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return isDarkTheme();
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`RingTower: failed to load ${url}`));
    img.src = url;
  });
}

/** `urls[i]` ends at `stops[i]` across the strip, 0 to 1 (AAK: for picking). */
type Strip = { canvas: HTMLCanvasElement; aspect: number; urls: string[]; stops: number[] };

/** Draws the images side by side at one height on a white strip. */
function stitch(images: HTMLImageElement[], urls: string[], maxSize: number): Strip | null {
  const sizes = images.map((img) => {
    const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
    return { img, width: STRIP_HEIGHT * aspect };
  });
  const width = sizes.reduce((sum, s) => sum + s.width, 0);
  if (width <= 0) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const scale = Math.min(
    Math.min(window.devicePixelRatio || 1, 2),
    maxSize / width,
    maxSize / STRIP_HEIGHT,
  );
  canvas.width = Math.max(1, Math.floor(width * scale));
  canvas.height = Math.max(1, Math.floor(STRIP_HEIGHT * scale));
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, STRIP_HEIGHT);
  let x = 0;
  const stops: number[] = [];
  for (const s of sizes) {
    ctx.drawImage(s.img, x, 0, s.width, STRIP_HEIGHT);
    x += s.width;
    stops.push(x / width);
  }
  return { canvas, aspect: width / STRIP_HEIGHT, urls, stops };
}

/** Plain green grid band, used when no image loads. */
function gridStrip(): Strip | null {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const fill = ctx.createLinearGradient(0, 0, 0, 512);
  fill.addColorStop(0, "#36C26A");
  fill.addColorStop(1, "#22A653");
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 1024; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }
  for (let i = 0; i <= 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }
  return { canvas, aspect: 2, urls: [], stops: [] };
}

/**
 * A tower of open, tilted cylinder bands wrapped in a strip of images, after
 * the vuemail.dev hero. Each band leans a quarter turn from the last, so the
 * stack zig-zags. The images crawl around the bands, dragging spins the
 * tower with inertia, and the pointer turns neighboring bands opposite ways.
 * The canvas is transparent; the parent paints the background, and the
 * inside of the bands fades toward black or white with the theme. Pauses
 * off-screen and in hidden tabs; holds still under `prefers-reduced-motion`.
 */
export function createRingTower(
  root: HTMLElement,
  initial: RingTowerOptions = {},
): RingTowerInstance | null {
  let options: RingTowerOptions = { draggable: true, ...initial };

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.touchAction = "pan-y";
  root.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(7, 1, 0.01, 1e5);
  camera.position.set(0, 0, 70);
  const tower = new Group();
  tower.rotation.set(-0.2, START_ANGLE, 0.2);
  scene.add(tower);

  const geometry = new CylinderGeometry(RADIUS, RADIUS, BAND_HEIGHT, SEGMENTS, 1, true);
  const backface = { value: DEFAULT_BACKFACE };
  let dark = resolveDark(options.theme ?? "auto");
  let darkMix = dark ? 1 : 0;
  const backColor = { value: new Color().setScalar(1 - darkMix) };

  type Band = {
    index: number;
    mesh: Mesh;
    material: MeshBasicMaterial;
    texture: Texture;
    tiles: number;
    key: string;
  };
  let bands: Band[] = [];
  // One strip per distinct image list, shared by every ring that shows it.
  // `base` is null while the images load.
  type Entry = {
    base: CanvasTexture | null;
    tiles: number;
    token: number;
    urls: string[];
    stops: number[];
  };
  const strips = new Map<string, Entry>();
  let rings = ringsOf(options.rings);
  // Kept across rebuilds, so a strip arriving never snaps a ring back.
  const crawls: number[] = [];
  const turns: number[] = [];

  const makeMaterial = (map: Texture) => {
    const material = new MeshBasicMaterial({
      map,
      side: DoubleSide,
      toneMapped: false,
    });
    material.onBeforeCompile = (shader) => {
      shader.uniforms["uBackface"] = backface;
      shader.uniforms["uBackColor"] = backColor;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          "uniform float uBackface;\nuniform vec3 uBackColor;\nvoid main() {",
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          if (!gl_FrontFacing) {
            diffuseColor.rgb = mix(diffuseColor.rgb, uBackColor, uBackface);
          }`,
        );
    };
    material.customProgramCacheKey = () => "ring-tower";
    return material;
  };

  const clearBands = () => {
    for (const band of bands) {
      tower.remove(band.mesh);
      band.material.dispose();
      band.texture.dispose();
    }
    bands = [];
  };

  // Whole tiles around the band keep the seam invisible; the strip is then
  // cropped top and bottom to hold its proportions. Returns the tile count.
  const fit = (texture: Texture, aspect: number) => {
    const around = (2 * Math.PI * RADIUS) / BAND_HEIGHT;
    const whole = Math.floor(around / aspect);
    if (whole >= 1) {
      texture.repeat.set(whole, Math.min(1, (aspect * whole) / around));
      texture.offset.y = (1 - texture.repeat.y) / 2;
      return whole;
    }
    texture.repeat.set(around / aspect, 1);
    texture.offset.y = 0;
    return around / aspect;
  };

  const imagesFor = (ring: RingTowerRing) =>
    urlsOf(ring.images).length ? urlsOf(ring.images) : urlsOf(options.images);
  const keyFor = (ring: RingTowerRing) => imagesFor(ring).join("\n");

  const buildBands = () => {
    clearBands();
    const middle = Math.ceil(rings.length / 2) - 1;
    rings.forEach((ring, i) => {
      const entry = strips.get(keyFor(ring));
      if (!entry?.base) return;
      // Clones share the image source, so each strip uploads once.
      const texture = entry.base.clone();
      const material = makeMaterial(texture);
      const mesh = new Mesh(geometry, material);
      mesh.position.set(0, (i - middle) * SPACING, 0);
      tower.add(mesh);
      bands.push({ index: i, mesh, material, texture, tiles: entry.tiles, key: keyFor(ring) });
    });
    pose();
  };

  const setStrip = (key: string, next: Strip | null) => {
    const entry = strips.get(key);
    if (!entry || !next) return;
    const texture = new CanvasTexture(next.canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    entry.tiles = fit(texture, next.aspect);
    entry.base = texture;
    entry.urls = next.urls;
    entry.stops = next.stops;
    buildBands();
    wake();
  };

  let loadToken = 0;
  let layoutKey = "";
  // Loads any image list a ring now needs, drops the ones none show, and
  // rebuilds the rings when their count or images change.
  const loadImages = () => {
    const needed = new Map(rings.map((ring) => [keyFor(ring), imagesFor(ring)]));
    for (const [key, entry] of strips) {
      if (needed.has(key)) continue;
      entry.base?.dispose();
      strips.delete(key);
    }
    for (const [key, urls] of needed) {
      if (strips.has(key)) continue;
      const token = ++loadToken;
      strips.set(key, { base: null, tiles: 1, token, urls: [], stops: [] });
      if (urls.length === 0) {
        setStrip(key, gridStrip());
        continue;
      }
      void Promise.allSettled(urls.map(loadImage)).then((results) => {
        if (destroyed || strips.get(key)?.token !== token) return;
        const ok = results.flatMap((r, i) => (r.status === "fulfilled" ? [i] : []));
        const loaded = ok.map(
          (i) => (results[i] as PromiseFulfilledResult<HTMLImageElement>).value,
        );
        const next = loaded.length
          ? stitch(
              loaded,
              ok.map((i) => urls[i]!),
              renderer.capabilities.maxTextureSize,
            )
          : null;
        setStrip(key, next ?? gridStrip());
      });
    }
    const nextLayout = rings.map(keyFor).join("\0");
    if (nextLayout !== layoutKey) {
      layoutKey = nextLayout;
      buildBands();
    }
  };

  // Each ring's lean, heading and spin, read live so sliders need no rebuild.
  const pose = () => {
    for (const band of bands) {
      const ring = rings[band.index] ?? {};
      const rotation = numberOr(ring.rotation, defaultRotation(band.index), -3600, 3600);
      const tilt = numberOr(ring.tilt, DEFAULT_TILT, -45, 45);
      band.mesh.rotation.set(0, rotation * DEG + (turns[band.index] ?? 0), tilt * DEG);
    }
  };

  const size = { width: 0, height: 0 };
  const current = new Vector2();
  /**
   * Sizes the renderer to the root; true when the canvas changed. Setting
   * the same size still clears the canvas, so it only sets a real change.
   */
  const resize = () => {
    const { width, height } = root.getBoundingClientRect();
    size.width = width;
    size.height = height;
    if (width <= 0 || height <= 0) return false;
    renderer.getSize(current);
    if (current.x === width && current.y === height) return false;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    wake();
    return true;
  };

  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let onScreen = true;
  let raf = 0;
  let destroyed = false;
  let lost = false;
  let last = 0;
  let angle = START_ANGLE;
  let velocity = 0;
  let dragging = false;
  let dragX = 0;
  let pointerX = 0;
  let pointerTarget = 0;

  const visible = () => onScreen && document.visibilityState !== "hidden";

  function wake() {
    if (raf || destroyed || lost) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  const tick = (now: number) => {
    raf = 0;
    if (lost) return;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (!visible()) return;
    const still = mqReduce.matches;

    const towerSpeed = numberOr(options.speed, DEFAULT_SPEED, 0, 4);
    const towerParallax = numberOr(options.parallax, DEFAULT_PARALLAX, 0, 90);
    let spinning = false;
    if (!still) {
      for (const band of bands) {
        const ring = rings[band.index] ?? {};
        const i = band.index;
        const speed = numberOr(ring.speed, towerSpeed, -4, 4);
        // In texture units, so wrapping at 1 never shows a jump.
        const crawl = (crawls[i] ?? 0) + dt * CRAWL * band.tiles * speed;
        crawls[i] = crawl - Math.floor(crawl);
        const spin = numberOr(ring.spin, DEFAULT_SPIN, -180, 180);
        if (spin !== 0) {
          turns[i] = ((turns[i] ?? 0) + spin * DEG * dt) % (Math.PI * 2);
          spinning = true;
        }
      }
    }
    pose();
    if (!dragging) {
      if (still) velocity = 0;
      angle += velocity * dt;
      velocity *= Math.pow(0.95, dt * 60);
      if (Math.abs(velocity) < 1e-4) velocity = 0;
    }
    tower.rotation.y = angle;

    const ease = 1 - Math.exp(-dt * 4);
    const target = still ? 0 : pointerTarget;
    pointerX += (target - pointerX) * ease;
    for (const band of bands) {
      const ring = rings[band.index] ?? {};
      const parallax = numberOr(ring.parallax, defaultParallax(band.index, towerParallax), -90, 90);
      band.texture.offset.x = (crawls[band.index] ?? 0) + (pointerX * parallax * band.tiles) / 360;
    }

    darkMix += ((dark ? 1 : 0) - darkMix) * (1 - Math.exp(-dt * 6));
    if (Math.abs((dark ? 1 : 0) - darkMix) < 1e-3) darkMix = dark ? 1 : 0;
    backColor.value.setScalar(1 - darkMix);

    if (size.width > 0 && size.height > 0) renderer.render(scene, camera);

    const moving =
      (!still && (towerSpeed !== 0 || spinning || rings.some((r) => r.speed))) ||
      dragging ||
      velocity !== 0 ||
      Math.abs(target - pointerX) > 1e-4 ||
      darkMix !== (dark ? 1 : 0);
    if (moving) raf = requestAnimationFrame(tick);
  };

  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const hits = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObjects(tower.children, false).length > 0;
  };

  /** (AAK) The photo under the pointer: where the hit lands along its strip. */
  const photoAt = (e: PointerEvent): RingTowerHit | null => {
    if (!hits(e)) return null;
    const hit = raycaster.intersectObjects(tower.children, false)[0];
    const band = bands.find((b) => b.mesh === hit?.object);
    const entry = band && strips.get(band.key);
    if (!hit?.uv || !band || !entry?.stops.length) return null;
    const u = hit.uv.x * band.texture.repeat.x + band.texture.offset.x;
    const along = u - Math.floor(u);
    const i = entry.stops.findIndex((stop) => along < stop);
    const url = entry.urls[i === -1 ? entry.urls.length - 1 : i];
    return url ? { url, ring: band.index, clientX: e.clientX, clientY: e.clientY } : null;
  };
  const picking = () => Boolean(options.onPick);
  // A press that barely moves is a click (pick), not a drag.
  let pressX = 0;
  let pressY = 0;
  let travelled = 0;

  const setCursor = (value: string) => {
    if (canvas.style.cursor !== value) canvas.style.cursor = value;
  };

  const onWindowMove = (e: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    pointerTarget = inside ? clamp(x * 2 - 1, -1, 1) : 0;
    wake();
  };
  window.addEventListener("pointermove", onWindowMove, { passive: true });

  const onDown = (e: PointerEvent) => {
    if (options.draggable === false || !hits(e)) return;
    dragging = true;
    dragX = e.clientX;
    pressX = e.clientX;
    pressY = e.clientY;
    travelled = 0;
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
    setCursor("grabbing");
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (dragging) {
      const delta = ((e.clientX - dragX) / Math.max(1, size.width)) * Math.PI * 2;
      angle += delta;
      velocity = delta * 60;
      dragX = e.clientX;
      travelled = Math.max(travelled, Math.hypot(e.clientX - pressX, e.clientY - pressY));
      if (travelled > 6) options.onHover?.(null);
      return;
    }
    const photo = options.onHover || picking() ? photoAt(e) : null;
    options.onHover?.(photo);
    setCursor(
      photo && picking() ? "pointer" : options.draggable !== false && hits(e) ? "grab" : "",
    );
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    const photo = e.type === "pointerup" && travelled <= 6 ? photoAt(e) : null;
    if (photo && options.onPick) {
      velocity = 0;
      options.onPick(photo);
    }
    setCursor(hits(e) ? "grab" : "");
    wake();
  };
  const onLeave = () => {
    if (!dragging) setCursor("");
    options.onHover?.(null);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  // Resizing cleared the canvas; draw the current pose now, or it shows
  // blank for a frame.
  const ro = new ResizeObserver(() => {
    if (resize() && !destroyed && !lost) renderer.render(scene, camera);
  });
  ro.observe(root);
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? true;
    wake();
  });
  io.observe(root);
  const onVisibility = () => wake();
  document.addEventListener("visibilitychange", onVisibility);
  const onReduce = () => wake();
  mqReduce.addEventListener("change", onReduce);

  // three restores its own state; the loop just has to stop and resume.
  const onLost = () => {
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onRestored = () => {
    if (destroyed) return;
    lost = false;
    for (const { base } of strips.values()) if (base) base.needsUpdate = true;
    wake();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  const syncTheme = () => {
    const next = resolveDark(options.theme ?? "auto");
    if (next === dark) return;
    dark = next;
    wake();
  };
  const mo = new MutationObserver(syncTheme);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme", "style"],
  });
  const mqDark = window.matchMedia("(prefers-color-scheme: dark)");
  mqDark.addEventListener("change", syncTheme);

  const applyBackface = () => {
    backface.value = numberOr(options.backface, DEFAULT_BACKFACE, 0, 1);
  };

  applyBackface();
  resize();
  loadImages();
  wake();

  return {
    setOptions(next) {
      options = { ...options, ...next };
      rings = ringsOf(options.rings);
      applyBackface();
      if (options.draggable === false) {
        dragging = false;
        setCursor("");
      }
      loadImages();
      syncTheme();
      wake();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mqReduce.removeEventListener("change", onReduce);
      mqDark.removeEventListener("change", syncTheme);
      window.removeEventListener("pointermove", onWindowMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      clearBands();
      for (const { base } of strips.values()) base?.dispose();
      strips.clear();
      geometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

export type RingTowerProps = RingTowerOptions & {
  className?: string;
};

/**
 * A tower of tilted bands wrapped in your images. The images crawl around
 * the bands, dragging spins the tower, and the pointer turns neighboring
 * bands opposite ways. Pass `rings` an array to set each ring's rotation,
 * tilt, spin, speed, parallax or images. Transparent; the parent paints the
 * background. Theme-aware.
 */
export function RingTower({
  className,
  images,
  rings = DEFAULT_RINGS,
  speed = DEFAULT_SPEED,
  draggable = true,
  parallax = DEFAULT_PARALLAX,
  backface = DEFAULT_BACKFACE,
  theme = "auto",
  onHover,
  onPick,
}: RingTowerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<RingTowerInstance | null>(null);
  // (AAK) The latest callbacks, so the engine never holds stale ones.
  const callbacksRef = useRef({ onHover, onPick });
  useEffect(() => {
    callbacksRef.current = { onHover, onPick };
  }, [onHover, onPick]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    instanceRef.current = createRingTower(root, {
      images,
      rings,
      speed,
      draggable,
      parallax,
      backface,
      theme,
      onHover: (hit) => callbacksRef.current.onHover?.(hit),
      onPick: callbacksRef.current.onPick ? (hit) => callbacksRef.current.onPick?.(hit) : undefined,
    });
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // Engine reads live options via setOptions; mount once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    instanceRef.current?.setOptions({
      images,
      rings,
      speed,
      draggable,
      parallax,
      backface,
      theme,
    });
  }, [images, rings, speed, draggable, parallax, backface, theme]);

  return (
    <div
      ref={rootRef}
      data-slot="ring-tower"
      aria-hidden
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit] [mask-image:linear-gradient(#000,#000)]",
        className,
      )}
    />
  );
}
