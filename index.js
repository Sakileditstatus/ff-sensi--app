const express = require("express");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Helper to extract numbers from strings like "8 Cores", "7.6 GB", "120 Hz"
function parseVal(val) {
    if (typeof val === "string") {
        const match = val.match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[0]) : NaN;
    }
    return parseFloat(val);
}

// Map GPU or Hardware strings to 1-4 tiers
function getGpuTier(gpuStr, hardware) {
    const s = (gpuStr || hardware || "").toLowerCase();
    if (s.includes("adreno 7") || s.includes("adreno 8") || s.includes("mali-g7") || s.includes("flagship") || s.includes("730") || s.includes("888") || s.includes("gen")) return 4;
    if (s.includes("adreno 6") || s.includes("mali-g6") || s.includes("high") || s.includes("618") || s.includes("720")) return 3;
    if (s.includes("adreno 5") || s.includes("mali-g5") || s.includes("mid") || s.includes("610") || s.includes("mt67")) return 2;
    return 1; // Default/Low
}

function normalize(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, Math.round(val)));
}

// Score 0–100 from 6 device factors
function calculateScore(cores, gpuTier, ram, rr, dpi, screen) {
    return Math.round(
        normalize(cores, 4, 12) * 20 + // Cores up to 12
        normalize(gpuTier, 1, 4) * 30 + // GPU is most important
        normalize(ram, 1, 16) * 20 +
        normalize(rr, 60, 165) * 15 +
        normalize(dpi, 100, 1600) * 10 +
        normalize(screen, 4.5, 7.5) * 5
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

function headShotSensitivity(score, dpi, rr, screen, gpuTier) {
    const tier = getDeviceTier(score);
    const recDPI = recommendDPI(score);

    let fine;
    if (tier === "low") fine = Math.round(normalize(score, 0, 33) * 10);
    else if (tier === "medium") fine = Math.round(normalize(score, 34, 66) * 10);
    else fine = Math.round(normalize(score, 67, 100) * 10);

    let baseGen;
    if (tier === "low") baseGen = 200 - fine; 
    else if (tier === "medium") baseGen = 190 - fine; 
    else baseGen = 180 - fine; 

    // Adjustments
    const dpiComp = clamp(Math.round((recDPI - dpi) / 30), -6, 6);
    const rrBonus = rr >= 120 ? -3 : rr >= 90 ? -1 : 0;
    const screenB = screen >= 6.7 ? 2 : screen <= 5.2 ? -2 : 0;
    const gpuB = gpuTier >= 4 ? -2 : gpuTier >= 3 ? -1 : 0;
    const adj = dpiComp + rrBonus + screenB + gpuB;

    const [gMin, gMax] = tier === "low" ? [180, 200] : tier === "medium" ? [170, 190] : [160, 180];
    const general = clamp(baseGen + adj, gMin, gMax);

    return {
        general,
        redDot: clamp(general - 5, gMin - 10, gMax),
        scope2x: clamp(general - 11, gMin - 20, gMax - 5),
        scope4x: clamp(general - 20, gMin - 35, gMax - 12),
        freelock: clamp(general - 30, gMin - 50, gMax - 22),
        awmSniper: clamp(general - 40, gMin - 65, gMax - 32),
    };
}

function getGraphics(score, ram, gpuTier, rr) {
    // 1. Base Preset by RAM
    let baseIndex = 0; // Smooth
    if (ram > 6) baseIndex = 3; // MAX
    else if (ram > 4) baseIndex = 2; // Ultra
    else if (ram > 2) baseIndex = 1; // Standard

    // 2. Processor Offset (If CPU/GPU is low, go back one step)
    let finalIndex = baseIndex;
    if (gpuTier <= 2) {
        finalIndex = Math.max(0, baseIndex - 1);
    }

    const presets = ["Smooth", "Standard", "Ultra", "MAX"];
    const preset = presets[finalIndex];

    // 3. FPS Logic (Normal, Enhanced, High)
    let fps = "Normal";
    if (score > 70 || (rr >= 90 && gpuTier >= 3)) fps = "High";
    else if (score > 40 || gpuTier >= 2) fps = "Enhanced";

    return { preset, fps };
}

function getProTips(score, rr, dpi, recDPI, screen, gpuTier) {
    const tips = [];
    const tier = getDeviceTier(score);
    tips.push("Niche se upar drag karo — feet se head tak. Yahi real headshot motion hai.");
    if (rr >= 120) tips.push(`${rr}Hz screen — FPS Ultra/Extreme set karo.`);
    else if (rr >= 90) tips.push(`${rr}Hz screen — sensitivity thodi high rakho.`);
    else tips.push("60Hz screen pe Motion Blur OFF karo.");
    const st = dpiStatus(dpi, recDPI);
    if (st === "too_high") tips.push(`DPI ${dpi} zyada hai. ${recDPI} pe set karo.`);
    if (st === "too_low") tips.push(`DPI ${dpi} kam hai. ${recDPI} pe raise karo.`);
    if (screen >= 6.5) tips.push("Bada screen — 4x scope drag headshot easy hoga.");
    if (gpuTier >= 3) tips.push("GPU/Hardware strong — HDR mode on karo.");
    if (score >= 67) tips.push("4x Anti-Aliasing on karo — target clearly dikhega.");
    if (tier === "low") {
        tips.push("Background apps band karo — RAM free karo.");
        tips.push("Phone thanda rakho — thermal throttle se aim shaky hoti hai.");
    }
    tips.push("Custom room mein drag practice karo — muscle memory se headshot rate badhti hai.");
    return tips;
}

function validate({ cores, ram, rr, dpi, screen }) {
    const errors = [];
    if (isNaN(cores) || cores < 1) errors.push("Invalid cores count");
    if (isNaN(ram) || ram < 0.5) errors.push("Invalid RAM value");
    if (isNaN(rr) || rr < 30) errors.push("Invalid Refresh Rate");
    if (isNaN(dpi) || dpi < 50) errors.push("Invalid DPI value");
    if (isNaN(screen) || screen < 3) errors.push("Invalid Screen size");
    return errors;
}

function buildResponse(res, { cores, gpuTier, ram, rr, dpi, screen, raw }) {
    const score = calculateScore(cores, gpuTier, ram, rr, dpi, screen);
    const tier = getDeviceTier(score);
    const recDPI = recommendDPI(score);
    const sensi = headShotSensitivity(score, dpi, rr, screen, gpuTier);
    const gfx = getGraphics(score, ram, gpuTier, rr);
    const tips = getProTips(score, rr, dpi, recDPI, screen, gpuTier);
    const tierLabel = { low: "Low-End", medium: "Mid-Range", high: "High-End" }[tier];

    return res.json({
        deviceInfo: {
            cores, ram, rr, dpi, screen, gpuTier,
            model: raw.model || "Unknown",
            hardware: raw.hardware || "Unknown"
        },
        deviceTier: tierLabel,
        sensitivity: sensi,
        graphics: gfx,
        dpi: {
            current: dpi,
            recommended: recDPI,
            status: dpiStatus(dpi, recDPI),
            advice: dpiAdvice(dpi, recDPI),
        },
        proTips: tips,
    });
}

// ═══ ROUTES ═══

app.get("/", (_req, res) => {
    res.json({
        name: "Alpha Sensi Headshot API",
        version: "8.0.0",
        endpoint: "/sensi",
        params: ["cores", "ram", "rr", "dpi", "screen", "gpu_name", "hardware", "model"]
    });
});

app.get("/sensi", (req, res) => {
    const { cores, ram, rr, dpi, screen, gpu_name, hardware, model } = req.query;
    
    const parsed = {
        cores: parseVal(cores),
        ram: parseVal(ram),
        rr: parseVal(rr),
        dpi: parseVal(dpi),
        screen: parseVal(screen) || 6.0,
        gpuTier: getGpuTier(gpu_name, hardware),
        raw: { model, hardware }
    };

    const errors = validate(parsed);
    if (errors.length) return res.status(400).json({ errors });

    return buildResponse(res, parsed);
});

app.post("/sensi", (req, res) => {
    const { cores, ram, rr, dpi, screen, gpu_name, hardware, model } = req.body || {};
    
    const parsed = {
        cores: parseVal(cores),
        ram: parseVal(ram),
        rr: parseVal(rr),
        dpi: parseVal(dpi),
        screen: parseVal(screen) || 6.0,
        gpuTier: getGpuTier(gpu_name, hardware),
        raw: { model, hardware }
    };

    const errors = validate(parsed);
    if (errors.length) return res.status(400).json({ errors });

    return buildResponse(res, parsed);
});

app.get("/health", (_req, res) => {
    res.json({ status: "ok", version: "8.0.0", uptime: Math.round(process.uptime()) + "s" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Alpha Sensi API v8.0 → http://localhost:${PORT}`));
