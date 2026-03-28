const express = require("express");
const app = express();
app.use(express.json());

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ─── HELPERS ────────────────────────────────────────────────────────────────
function normalize(value, min, max) {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, Math.round(val)));
}

// ─── DEVICE SCORE ───────────────────────────────────────────────────────────
// cores  : 4 | 6 | 8 | 10
// gpu    : 1=Low  2=Mid  3=High  4=Flagship
// ram    : 2–16 GB
// rr     : 60–165 Hz
// dpi    : 100–3200
// screen : 5–7 inch
function calculateScore(cores, gpu, ram, rr, dpi, screen) {
  const coreScore   = normalize(cores,  4,  10) * 25;
  const gpuScore    = normalize(gpu,    1,   4) * 25;
  const ramScore    = normalize(ram,    2,  16) * 20;
  const rrScore     = normalize(rr,    60, 165) * 18;
  const dpiScore    = normalize(dpi,  100, 1600) *  7;
  const screenScore = normalize(screen, 5,   7) *  5;
  return Math.round(coreScore + gpuScore + ramScore + rrScore + dpiScore + screenScore);
}

// ─── DEVICE TIER ────────────────────────────────────────────────────────────
function getDeviceTier(score) {
  if (score < 20) return "Low-End";
  if (score < 40) return "Mid-Range";
  if (score < 60) return "Upper-Mid";
  if (score < 80) return "High-End";
  return "Flagship";
}

// ─── RECOMMENDED DPI ────────────────────────────────────────────────────────
function recommendDPI(score) {
  if (score < 20) return 300;
  if (score < 35) return 400;
  if (score < 50) return 500;
  if (score < 65) return 700;
  if (score < 80) return 900;
  return 1200;
}

// ─── DPI STATUS & ADVICE ────────────────────────────────────────────────────
function dpiStatus(current, recommended) {
  const diff = current - recommended;
  if (Math.abs(diff) <= 100) return "optimal";
  return diff < 0 ? "too_low" : "too_high";
}

function dpiAdvice(current, recommended) {
  const s = dpiStatus(current, recommended);
  if (s === "optimal")  return `DPI ${current} is perfect for your device. No change needed.`;
  if (s === "too_low")  return `DPI ${current} is too low. Raise to ${recommended} for smoother tracking.`;
  return `DPI ${current} is too high — causes input lag & shaky aim. Lower to ${recommended}.`;
}

// ─── HEADSHOT SENSITIVITY (single combined formula) ──────────────────────────
// One formula covers all playstyles — optimised for headshot accuracy
// Factors: device score, DPI compensation, refresh rate bonus,
//          screen size adjustment, GPU smoothness bonus
function headShotSensitivity(score, dpi, rr, screen, gpu) {
  const recDPI_  = recommendDPI(score);
  const dpiComp  = (recDPI_ / dpi) * 7;          // compensate low/high DPI
  const rrBonus  = rr >= 120 ? -4 : rr >= 90 ? -2 : 0;  // high RR → slightly lower sens
  const screenB  = screen >= 6.5 ? 3 : screen <= 5 ? -3 : 0; // bigger screen → higher sens
  const gpuBonus = gpu >= 3 ? -2 : 0;            // smooth GPU → tighter control
  const base     = 168 - score * 1.42;

  return {
    general:   clamp(base + 14 + dpiComp + rrBonus + screenB + gpuBonus, 1, 200),
    redDot:    clamp(base +  9 + dpiComp + rrBonus + screenB + gpuBonus, 1, 200),
    scope2x:   clamp(base +  4 + dpiComp + rrBonus + screenB + gpuBonus, 1, 200),
    scope4x:   clamp(base -  4 + dpiComp + rrBonus + screenB + gpuBonus, 1, 200),
    scope8x:   clamp(base - 12 + dpiComp + rrBonus + screenB + gpuBonus, 1, 200),
    awmSniper: clamp(base - 20 + dpiComp + rrBonus + screenB + gpuBonus, 1, 200),
  };
}

// ─── GRAPHICS SETTINGS ──────────────────────────────────────────────────────
function getGraphics(score, rr) {
  if (score < 20) return { graphics: "Smooth",   fps: "Low",                             resolution: "Low",  shadowQuality: "Off"   };
  if (score < 35) return { graphics: "Smooth",   fps: "Medium",                          resolution: "HD",   shadowQuality: "Off"   };
  if (score < 50) return { graphics: "Smooth",   fps: rr >= 90 ? "High" : "Medium",      resolution: "HD",   shadowQuality: "Low"   };
  if (score < 65) return { graphics: "Standard", fps: "High",                            resolution: "FHD",  shadowQuality: "Medium"};
  if (score < 80) return { graphics: "High",     fps: rr >= 120 ? "Ultra"    : "High",   resolution: "FHD",  shadowQuality: "High"  };
  return               { graphics: "Ultra",    fps: rr >= 120 ? "Extreme"  : "Ultra",  resolution: "FHD+", shadowQuality: "Ultra" };
}

// ─── PRO TIPS ───────────────────────────────────────────────────────────────
function getProTips(score, rr, dpi, recDPI, screen, gpu) {
  const tips = [];

  tips.push("Niche se upar drag karo — feet se head tak. Yahi real headshot motion hai.");

  if (rr >= 120) tips.push("120Hz+ screen hai — FPS Ultra/Extreme set karo, har frame pe advantage milega.");
  else if (rr >= 90) tips.push("90Hz screen hai — sensitivity thodi high rakho, aiming faster hogi.");
  else tips.push("60Hz screen pe Motion Blur OFF karo — headshot accuracy badhegi.");

  const st = dpiStatus(dpi, recDPI);
  if (st === "too_high") tips.push(`DPI ${dpi} zyada hai. ${recDPI} pe set karo — aim shaky nahi hogi.`);
  if (st === "too_low")  tips.push(`DPI ${dpi} kam hai. ${recDPI} pe raise karo — tracking smooth hogi.`);

  if (screen >= 6.5) tips.push("Bada screen hai — 4x scope pe drag headshot easy hoga, practice karo.");
  if (screen <= 5)   tips.push("Chota screen hai — general sensitivity thodi badhao, aim fast karo.");

  if (gpu >= 3) tips.push("GPU strong hai — HDR mode on karo, enemy visibility better hogi.");
  if (score >= 60) tips.push("4x Anti-Aliasing on karo — target clearly dikhega, headshot easy hoga.");

  if (score < 35) {
    tips.push("Low-end device: background apps band karo, RAM free hone se aim smoother hogi.");
    tips.push("Phone thanda rakho — thermal throttle se aim shaky ho jaata hai.");
    tips.push("M1887 ya Shotgun use karo — fast kill without long tracking needed.");
  }

  tips.push("Custom room mein drag practice karo — muscle memory se headshot rate 3x badhti hai.");

  return tips;
}

// ─── VALIDATION HELPER ───────────────────────────────────────────────────────
function validate(params) {
  const errors = [];
  const { cores, gpu, ram, rr, dpi, screen } = params;

  if (![4, 6, 8, 10].includes(cores))   errors.push("cores must be 4, 6, 8, or 10");
  if (gpu < 1 || gpu > 4)               errors.push("gpu must be 1, 2, 3, or 4");
  if (ram < 2 || ram > 16)              errors.push("ram must be 2–16 GB");
  if (rr < 60 || rr > 165)              errors.push("rr must be 60–165 Hz");
  if (dpi < 100 || dpi > 3200)          errors.push("dpi must be 100–3200");
  if (screen < 4.5 || screen > 7.5)     errors.push("screen must be 4.5–7.5 inch");

  return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// ─── GET / ──────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    name:    "Free Fire Headshot Sensitivity API",
    version: "6.0.0",
    author:  "FF Sensi Engine",
    routes: {
      "GET /":          "API guide & documentation",
      "GET /sensi":     "Generate headshot sensitivity from device params",
      "POST /sensi":    "Same as GET but accepts JSON body",
      "GET /health":    "Health check",
    },
    parameters: {
      cores:  "CPU core count — 4 | 6 | 8 | 10",
      gpu:    "GPU tier — 1=Low (Mali-G52)  2=Mid (Adreno 610)  3=High (Adreno 618)  4=Flagship (Adreno 730)",
      ram:    "RAM in GB — 2 to 16",
      rr:     "Refresh rate in Hz — 60 | 90 | 120 | 144 | 165",
      dpi:    "Touch DPI — 100 to 3200",
      screen: "Screen size in inches — 4.5 to 7.5",
    },
    gpuTiers: {
      1: "Low      — IMG GE8320, Mali-G52, Mali-G31",
      2: "Mid      — Mali-G57, Adreno 610, Mali-G68",
      3: "High     — Mali-G76, Adreno 618, Adreno 619",
      4: "Flagship — Adreno 730, Adreno 740, Mali-G710, Immortalis-G715",
    },
    example: "/sensi?cores=8&gpu=2&ram=4&rr=60&dpi=400&screen=6.0",
  });
});

// ─── GET /sensi ──────────────────────────────────────────────────────────────
app.get("/sensi", (req, res) => {
  const cores  = parseInt(req.query.cores);
  const gpu    = parseInt(req.query.gpu);
  const ram    = parseFloat(req.query.ram);
  const rr     = parseFloat(req.query.rr);
  const dpi    = parseFloat(req.query.dpi);
  const screen = parseFloat(req.query.screen);

  // Check missing
  const missing = [];
  if (isNaN(cores))  missing.push("cores");
  if (isNaN(gpu))    missing.push("gpu");
  if (isNaN(ram))    missing.push("ram");
  if (isNaN(rr))     missing.push("rr");
  if (isNaN(dpi))    missing.push("dpi");
  if (isNaN(screen)) missing.push("screen");

  if (missing.length > 0) {
    return res.status(400).json({
      error:   "Missing required parameters: " + missing.join(", "),
      example: "/sensi?cores=8&gpu=2&ram=4&rr=60&dpi=400&screen=6.0",
    });
  }

  const errors = validate({ cores, gpu, ram, rr, dpi, screen });
  if (errors.length > 0) return res.status(400).json({ errors });

  return buildResponse(res, { cores, gpu, ram, rr, dpi, screen });
});

// ─── POST /sensi ─────────────────────────────────────────────────────────────
app.post("/sensi", (req, res) => {
  const { cores, gpu, ram, rr, dpi, screen } = req.body || {};

  const parsed = {
    cores:  parseInt(cores),
    gpu:    parseInt(gpu),
    ram:    parseFloat(ram),
    rr:     parseFloat(rr),
    dpi:    parseFloat(dpi),
    screen: parseFloat(screen),
  };

  const missing = Object.entries(parsed)
    .filter(([, v]) => isNaN(v))
    .map(([k]) => k);

  if (missing.length > 0) {
    return res.status(400).json({
      error:   "Missing required fields: " + missing.join(", "),
      example: { cores: 8, gpu: 2, ram: 4, rr: 60, dpi: 400, screen: 6.0 },
    });
  }

  const errors = validate(parsed);
  if (errors.length > 0) return res.status(400).json({ errors });

  return buildResponse(res, parsed);
});

// ─── SHARED RESPONSE BUILDER ─────────────────────────────────────────────────
function buildResponse(res, { cores, gpu, ram, rr, dpi, screen }) {
  const score    = calculateScore(cores, gpu, ram, rr, dpi, screen);
  const recDPI   = recommendDPI(score);
  const tier     = getDeviceTier(score);
  const sens     = headShotSensitivity(score, dpi, rr, screen, gpu);
  const graphics = getGraphics(score, rr);
  const tips     = getProTips(score, rr, dpi, recDPI, screen, gpu);

  return res.json({
    device: {
      cores,
      gpu,
      gpuLabel: ["", "Low", "Mid", "High", "Flagship"][gpu],
      ram,
      refreshRate: rr,
      dpi,
      screenInch: screen,
      score,
      tier,
    },
    dpi: {
      current:     dpi,
      recommended: recDPI,
      status:      dpiStatus(dpi, recDPI),
      advice:      dpiAdvice(dpi, recDPI),
    },
    sensitivity: {
      description: "Optimised headshot sensitivity for your device — covers drag, one-tap & deadshot",
      values: sens,
    },
    graphics,
    proTips: tips,
  });
}

// ─── GET /health ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "6.0.0", uptime: Math.round(process.uptime()) + "s" });
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found. See GET / for docs." });
});

// ─── START ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FF Sensi API v6.0 → http://localhost:${PORT}`);
});
