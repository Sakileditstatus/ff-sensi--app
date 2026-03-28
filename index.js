const express = require("express");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function normalize(value, min, max) {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, Math.round(val)));
}

// Score 0–100 from 6 device factors
function calculateScore(cores, gpu, ram, rr, dpi, screen) {
  return Math.round(
    normalize(cores,   4,  10) * 25 +
    normalize(gpu,     1,   4) * 25 +
    normalize(ram,     2,  16) * 20 +
    normalize(rr,     60, 165) * 18 +
    normalize(dpi,   100,1600) *  7 +
    normalize(screen,4.5, 7.5) *  5
  );
}

// Three tiers: low=0–33, medium=34–66, high=67–100
function getDeviceTier(score) {
  if (score <= 33) return "low";
  if (score <= 66) return "medium";
  return "high";
}

function recommendDPI(score) {
  if (score <= 20) return 300;
  if (score <= 33) return 400;
  if (score <= 50) return 500;
  if (score <= 66) return 700;
  if (score <= 80) return 900;
  return 1200;
}

function dpiStatus(current, recommended) {
  const diff = current - recommended;
  if (Math.abs(diff) <= 100) return "optimal";
  return diff < 0 ? "too_low" : "too_high";
}

function dpiAdvice(current, recommended) {
  const s = dpiStatus(current, recommended);
  if (s === "optimal") return `DPI ${current} is perfect. No change needed.`;
  if (s === "too_low") return `DPI ${current} is too low. Raise to ${recommended} for smoother tracking.`;
  return `DPI ${current} is too high — causes shaky aim. Lower to ${recommended}.`;
}

// Sensitivity with tier-locked ranges:
//   Low    → General 180–200
//   Medium → General 170–190
//   High   → General 160–180
function headShotSensitivity(score, dpi, rr, screen, gpu) {
  const tier   = getDeviceTier(score);
  const recDPI = recommendDPI(score);

  // Fine-tune 0–10 within each tier (higher score = lower sens within range)
  let fine;
  if (tier === "low")    fine = Math.round(normalize(score,  0, 33) * 10);
  else if (tier === "medium") fine = Math.round(normalize(score, 34, 66) * 10);
  else                   fine = Math.round(normalize(score, 67, 100) * 10);

  // Base general per tier: top of range minus fine
  let baseGen;
  if (tier === "low")    baseGen = 200 - fine; // 200→190
  else if (tier === "medium") baseGen = 190 - fine; // 190→180
  else                   baseGen = 180 - fine; // 180→170

  // Adjustments
  const dpiComp  = clamp(Math.round((recDPI - dpi) / 30), -6, 6);
  const rrBonus  = rr >= 120 ? -3 : rr >= 90 ? -1 : 0;
  const screenB  = screen >= 6.7 ? 2 : screen <= 5.2 ? -2 : 0;
  const gpuB     = gpu >= 4 ? -2 : gpu >= 3 ? -1 : 0;
  const adj      = dpiComp + rrBonus + screenB + gpuB;

  // Tier clamp ranges
  const [gMin, gMax] = tier === "low" ? [180, 200] : tier === "medium" ? [170, 190] : [160, 180];
  const general = clamp(baseGen + adj, gMin, gMax);

  return {
    general,
    redDot:    clamp(general - 5,  gMin - 10, gMax),
    scope2x:   clamp(general - 11, gMin - 20, gMax - 5),
    scope4x:   clamp(general - 20, gMin - 35, gMax - 12),
    scope8x:   clamp(general - 30, gMin - 50, gMax - 22),
    awmSniper: clamp(general - 40, gMin - 65, gMax - 32),
  };
}

// Graphics: returns preset + fps only
function getGraphics(score, rr) {
  if (score <= 20) return { preset: "Smooth",   fps: "Low"     };
  if (score <= 33) return { preset: "Smooth",   fps: "Medium"  };
  if (score <= 50) return { preset: "Smooth",   fps: rr >= 90 ? "High" : "Medium" };
  if (score <= 66) return { preset: "Standard", fps: "High"    };
  if (score <= 80) return { preset: "High",     fps: rr >= 120 ? "Ultra"   : "High"  };
  return               { preset: "Ultra",    fps: rr >= 120 ? "Extreme" : "Ultra" };
}

function getProTips(score, rr, dpi, recDPI, screen, gpu) {
  const tips = [];
  const tier = getDeviceTier(score);
  tips.push("Niche se upar drag karo — feet se head tak. Yahi real headshot motion hai.");
  if (rr >= 120)     tips.push(`${rr}Hz screen — FPS Ultra/Extreme set karo.`);
  else if (rr >= 90) tips.push(`${rr}Hz screen — sensitivity thodi high rakho.`);
  else               tips.push("60Hz screen pe Motion Blur OFF karo.");
  const st = dpiStatus(dpi, recDPI);
  if (st === "too_high") tips.push(`DPI ${dpi} zyada hai. ${recDPI} pe set karo.`);
  if (st === "too_low")  tips.push(`DPI ${dpi} kam hai. ${recDPI} pe raise karo.`);
  if (screen >= 6.5) tips.push("Bada screen — 4x scope drag headshot easy hoga.");
  if (gpu >= 3)      tips.push("GPU strong — HDR mode on karo.");
  if (score >= 67)   tips.push("4x Anti-Aliasing on karo — target clearly dikhega.");
  if (tier === "low") {
    tips.push("Background apps band karo — RAM free karo.");
    tips.push("Phone thanda rakho — thermal throttle se aim shaky hoti hai.");
  }
  tips.push("Custom room mein drag practice karo — muscle memory se headshot rate badhti hai.");
  return tips;
}

function validate({ cores, gpu, ram, rr, dpi, screen }) {
  const errors = [];
  if (![4, 6, 8, 10].includes(cores)) errors.push("cores must be 4, 6, 8, or 10");
  if (gpu < 1 || gpu > 4)             errors.push("gpu must be 1–4");
  if (ram < 2 || ram > 16)            errors.push("ram must be 2–16 GB");
  if (rr < 60 || rr > 165)            errors.push("rr must be 60–165 Hz");
  if (dpi < 100 || dpi > 3200)        errors.push("dpi must be 100–3200");
  if (screen < 4.5 || screen > 7.5)   errors.push("screen must be 4.5–7.5 inch");
  return errors;
}

function buildResponse(res, { cores, gpu, ram, rr, dpi, screen }) {
  const score  = calculateScore(cores, gpu, ram, rr, dpi, screen);
  const tier   = getDeviceTier(score);
  const recDPI = recommendDPI(score);
  const sens   = headShotSensitivity(score, dpi, rr, screen, gpu);
  const gfx    = getGraphics(score, rr);
  const tips   = getProTips(score, rr, dpi, recDPI, screen, gpu);
  const tierLabel = { low: "Low-End", medium: "Mid-Range", high: "High-End" }[tier];

  return res.json({
    deviceTier: tierLabel,
    sensitivity: {
      general:   sens.general,
      redDot:    sens.redDot,
      scope2x:   sens.scope2x,
      scope4x:   sens.scope4x,
      scope8x:   sens.scope8x,
      awmSniper: sens.awmSniper,
    },
    graphics: gfx,
    dpi: {
      current:     dpi,
      recommended: recDPI,
      status:      dpiStatus(dpi, recDPI),
      advice:      dpiAdvice(dpi, recDPI),
    },
    proTips: tips,
  });
}

// ═══ ROUTES ═══

app.get("/", (_req, res) => {
  res.json({
    name: "Free Fire Headshot Sensitivity API",
    version: "7.0.0",
    routes: {
      "GET /":       "API guide",
      "GET /sensi":  "Generate sensitivity via query params",
      "POST /sensi": "Generate sensitivity via JSON body",
      "GET /health": "Health check",
    },
    parameters: {
      cores:  "CPU cores — 4 | 6 | 8 | 10",
      gpu:    "GPU tier — 1=Low | 2=Mid | 3=High | 4=Flagship",
      ram:    "RAM GB — 2 to 16",
      rr:     "Refresh rate Hz — 60 | 90 | 120 | 144 | 165",
      dpi:    "Touch DPI — 100 to 3200",
      screen: "Screen inches — 4.5 to 7.5",
    },
    sensitivityRanges: {
      "Low-End":  "General 180–200",
      "Mid-Range":"General 170–190",
      "High-End": "General 160–180",
    },
    gpuTiers: {
      1: "Low      — Mali-G52, IMG GE8320",
      2: "Mid      — Mali-G57, Adreno 610",
      3: "High     — Mali-G76, Adreno 618",
      4: "Flagship — Adreno 730, Mali-G710",
    },
    example: "/sensi?cores=8&gpu=2&ram=4&rr=60&dpi=400&screen=6.0",
  });
});

app.get("/sensi", (req, res) => {
  const cores  = parseInt(req.query.cores);
  const gpu    = parseInt(req.query.gpu);
  const ram    = parseFloat(req.query.ram);
  const rr     = parseFloat(req.query.rr);
  const dpi    = parseFloat(req.query.dpi);
  const screen = parseFloat(req.query.screen);

  const missing = [];
  if (isNaN(cores))  missing.push("cores");
  if (isNaN(gpu))    missing.push("gpu");
  if (isNaN(ram))    missing.push("ram");
  if (isNaN(rr))     missing.push("rr");
  if (isNaN(dpi))    missing.push("dpi");
  if (isNaN(screen)) missing.push("screen");
  if (missing.length) return res.status(400).json({ error: "Missing: " + missing.join(", "), example: "/sensi?cores=8&gpu=2&ram=4&rr=60&dpi=400&screen=6.0" });

  const errors = validate({ cores, gpu, ram, rr, dpi, screen });
  if (errors.length) return res.status(400).json({ errors });

  return buildResponse(res, { cores, gpu, ram, rr, dpi, screen });
});

app.post("/sensi", (req, res) => {
  const { cores, gpu, ram, rr, dpi, screen } = req.body || {};
  const parsed = {
    cores: parseInt(cores), gpu: parseInt(gpu),
    ram: parseFloat(ram),   rr: parseFloat(rr),
    dpi: parseFloat(dpi),   screen: parseFloat(screen),
  };
  const missing = Object.entries(parsed).filter(([, v]) => isNaN(v)).map(([k]) => k);
  if (missing.length) return res.status(400).json({ error: "Missing: " + missing.join(", ") });
  const errors = validate(parsed);
  if (errors.length) return res.status(400).json({ errors });
  return buildResponse(res, parsed);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "7.0.0", uptime: Math.round(process.uptime()) + "s" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found. See GET / for docs." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FF Sensi API v7.0 → http://localhost:${PORT}`));
