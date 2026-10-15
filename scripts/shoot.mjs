/**
 * FILE: scripts/shoot.mjs
 * Chụp màn hình bản đang chạy bằng Chrome headless + CDP (không thêm dependency —
 * dùng `ws` đã có trong project và Chrome/Edge cài sẵn trên máy).
 *
 * Vì sao cần: trình duyệt nhúng trong app không chụp được (visibilityState=hidden),
 * mà mọi cổng nghiệm thu UI đều yêu cầu ảnh thật. Script này mở Chrome headless,
 * dựng viewport theo từng cỡ, bật dark/light giả lập, bỏ qua màn "Ai đang chơi?"
 * bằng localStorage, rồi xuất PNG + một file manifest đo được (lỗi console,
 * tràn ngang, phần tử dưới 44px).
 *
 * Cách dùng:
 *   npm run shoot                          # mọi route, 4 cỡ, dark+light → docs/ui-review/shots
 *   npm run shoot -- --routes=/,/duyet --widths=1280 --modes=dark
 *   npm run shoot -- --full                # chụp cả trang (cuộn) thay vì chỉ một màn
 *   npm run shoot -- --base=http://localhost:3000 --out=docs/ui-review/v1
 *
 * Cờ:
 *   --base    gốc URL (mặc định http://localhost:3000)
 *   --out     thư mục ra file (mặc định docs/ui-review/shots)
 *   --routes  danh sách route phẩy nhau, "all" = mặc định bên dưới
 *   --widths  360,768,1280,1920
 *   --modes   dark,light
 *   --full    chụp toàn bộ chiều dài trang
 *   --settle  ms chờ sau khi load (mặc định 1500)
 */

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import WebSocket from "ws";

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const ALL_ROUTES = [
  "/", "/bo-bai", "/duyet", "/ngu-hanh", "/luat-choi", "/quiz",
  "/san-choi-ngu-am", "/choi-thu", "/choi-thu-ngay", "/ho-so",
  "/nhac-cu/dan-bau", "/admin",
];

/** Hồ sơ giả để app không chặn bằng modal "Ai đang chơi?" mỗi lần chụp. */
const SEED = `
  localStorage.setItem('ngucung_profiles', JSON.stringify([{id:'p-shot',name:'Người thử',avatar:'united',isKid:false}]));
  localStorage.setItem('ngucung_profile', 'p-shot');
`;

const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v === undefined ? true : v];
  })
);

const BASE = argv.base || "http://localhost:3000";
const OUT = path.resolve(process.cwd(), argv.out || "docs/ui-review/shots");
/** Git Bash biến "/x" thành đường dẫn Windows — cho phép viết "home" thay cho "/". */
const ROUTE_ALIAS = { home: "/", root: "/", "chi-tiet": "/nhac-cu/dan-bau" };
const ROUTES = (!argv.routes || argv.routes === "all"
  ? ALL_ROUTES
  : String(argv.routes).split(",").map((r) => ROUTE_ALIAS[r] ?? r)
).map((r) => (r.startsWith("/") ? r : "/" + r));
const WIDTHS = (argv.widths || "360,768,1280,1920").split(",").map(Number);
const MODES = (argv.modes || "dark,light").split(",");
const FULL = Boolean(argv.full);
const SETTLE = Number(argv.settle || 1500);
const PORT = 9333;

const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("Không tìm thấy Chrome/Edge để chụp màn hình.");
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  return chrome;
}

/** Kết nối CDP rồi gửi một lệnh, trả về result. */
class Session {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.listeners = [];
    ws.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
        this.listeners.forEach((fn) => fn(msg));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(fn) {
    this.listeners.push(fn);
  }
}

async function waitForDevtools(port) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return res.json();
    } catch {
      /* Chrome chưa kịp mở cổng debug */
    }
    await sleep(250);
  }
  throw new Error("Chrome không mở cổng DevTools");
}

async function main() {
  // Chrome ở lượt chạy trước có thể còn giữ khoá thư mục profile, nên mỗi lượt
  // dùng một profile riêng và dọn thử các profile cũ (thất bại thì bỏ qua).
  const stamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const profileDir = path.join(process.cwd(), `.chrome-shoot-${stamp}`);
  for (const stale of fs.readdirSync(process.cwd())) {
    if (stale === ".chrome-shoot" || stale.startsWith(".chrome-shoot-")) {
      try {
        fs.rmSync(path.join(process.cwd(), stale), { recursive: true, force: true, maxRetries: 2 });
      } catch {
        /* đang bị khoá — để lại, không chặn lượt chụp */
      }
    }
  }

  const child = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profileDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-timer-throttling",
      "--renderer-process-limit=1",
      "--enable-unsafe-swiftshader",
      "--use-angle=swiftshader",
      "--hide-scrollbars",
      "--window-size=1280,900",
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  child.on("error", (e) => console.error("Không chạy được Chrome:", e.message));

  try {
    await waitForDevtools(PORT);
    const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const page = targets.find((t) => t.type === "page");
    if (!page) throw new Error("Không có page target");

    const session = new Session(new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false }));
    await new Promise((res, rej) => {
      session.ws.on("open", res);
      session.ws.on("error", rej);
    });

    await session.send("Page.enable");
    await session.send("Runtime.enable");
    await session.send("Log.enable");

    const manifest = [];
    for (const route of ROUTES) {
      for (const width of WIDTHS) {
        for (const mode of MODES) {
          const name = `${(route === "/" ? "home" : route).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-${width}-${mode}`;
          const file = path.join(OUT, `${name}.png`);
          try {
            const shot = await capture(session, route, width, mode, file);
            manifest.push({ name, route, width, mode, ...shot });
            console.log(
              `  ✓ ${name}.png  ${shot.height}px cao · ${shot.errors.length} lỗi console · ${shot.issues?.overflow ? "TRÀN NGANG " : ""}${shot.issues?.smallTap ?? "?"} chạm nhỏ · ${shot.issues?.tinyText ?? "?"} chữ <13px`
            );
            if (width === 1280 && shot.issues?.top?.length) {
              for (const t of shot.issues.top) console.log(`      · chạm nhỏ: ${t}`);
            }
          } catch (err) {
            console.log(`  ✗ ${name}: ${err.message}`);
            manifest.push({ name, route, width, mode, error: err.message });
          }
        }
      }
    }

    fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
    const errs = manifest.filter((m) => m.errors?.length);
    console.log(`\n${manifest.length} ảnh → ${OUT}`);
    console.log(`manifest.json: ${errs.length} ảnh có lỗi console`);
    if (errs.length) {
      const uniq = new Set(errs.flatMap((m) => m.errors));
      [...uniq].slice(0, 10).forEach((e) => console.log("  ! " + e.slice(0, 160)));
    }
    session.ws.close();
  } finally {
    child.kill();
  }
}

/** Một lượt chụp: dựng viewport → seed localStorage → mở route → chờ → bắt lỗi → PNG. */
async function capture(session, route, width, mode, file) {
  const height = width <= 420 ? 860 : width <= 820 ? 1000 : 900;
  await session.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 820,
  });
  await session.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: mode },
      { name: "color-gamut", value: "srgb" },
    ],
  });

  const errors = [];
  const collector = (msg) => {
    if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails;
      errors.push(d.exception?.description || d.text || "exception");
    } else if (msg.method === "Log.entryAdded") {
      const e = msg.params.entry;
      if (e.level === "error" && !/favicon|Download the React DevTools|HMR/i.test(e.text)) errors.push(e.text);
    }
  };
  session.on(collector);

  const origin = new URL(BASE).origin;
  await session.send("Page.navigate", { url: origin + "/" });
  await sleep(300);
  await session.send("Runtime.evaluate", { expression: SEED, returnByValue: true });

  const loaded = new Promise((res) => {
    const fn = (msg) => {
      if (msg.method === "Page.loadEventFired") {
        session.listeners.splice(session.listeners.indexOf(fn), 1);
        res();
      }
    };
    session.listeners.push(fn);
  });
  await session.send("Page.navigate", { url: BASE + route });
  await loaded;
  await session.send("Runtime.evaluate", {
    expression: "document.fonts.ready.then(()=>1)",
    awaitPromise: true,
  });
  await sleep(SETTLE);

  const issues = await session
    .send("Runtime.evaluate", { expression: MEASURE, returnByValue: true })
    .then((r) => r.result.value)
    .catch(() => null);

  const shot = await session.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: FULL,
    optimizeForSpeed: false,
  });
  fs.writeFileSync(file, Buffer.from(shot.data, "base64"));

  session.listeners.splice(session.listeners.indexOf(collector), 1);
  return {
    height: issues?.pageHeight ?? null,
    issues,
    errors: [...new Set(errors)].slice(0, 6),
  };
}

/** Đo nhanh tại chỗ: tràn ngang, chữ quá nhỏ, vùng chạm dưới 44px, chữ bị cắt. */
const MEASURE = `(() => {
  const vw = innerWidth;
  const tiny = {}; const bad = {}; let smallTap = 0, taps = 0, clipped = 0;
  const label = (el) => {
    const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 22);
    const c = [...el.classList].filter(x => !/^(text|font|leading|tracking)/.test(x)).slice(0, 3).join('.');
    return el.tagName.toLowerCase() + (c ? '.' + c : '') + (t ? ' [' + t + ']' : '');
  };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    const fs = Math.round(parseFloat(cs.fontSize));
    if (own && fs < 13) tiny[fs] = (tiny[fs] || 0) + 1;
    if (own && el.scrollWidth - el.clientWidth > 2 && cs.overflowX !== 'visible') clipped++;
    if (el.matches('a,button') && !el.closest('[inert]') && !el.classList.contains('sr-only')) {
      taps++;
      // Link chữ trần trong câu (display:inline, không nền, không viền) được WCAG 2.5.8 miễn.
      const plainLink = cs.display === 'inline' && (cs.backgroundColor === 'rgba(0, 0, 0, 0)')
        && parseFloat(cs.borderTopWidth) === 0 && parseFloat(cs.borderBottomWidth) === 0;
      if (!plainLink && (r.height < 44 || r.width < 44)) {
        smallTap++;
        const k = label(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height);
        bad[k] = (bad[k] || 0) + 1;
      }
    }
  }
  const top = Object.entries(bad).sort((a,b)=>b[1]-a[1]).slice(0, 14).map(([k,v])=>k+(v>1?' x'+v:''));
  return {
    pageHeight: Math.round(document.documentElement.scrollHeight),
    overflow: document.documentElement.scrollWidth - vw,
    tinyText: Object.entries(tiny).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+'px:'+v).join(' '),
    tiny: Object.values(tiny).reduce((a,b)=>a+b,0),
    smallTap, taps, clipped, top,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 40),
  };
})()`;

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
