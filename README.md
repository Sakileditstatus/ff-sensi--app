# Free Fire Headshot Sensitivity API v6.0

Device specs dalo → Real headshot sensitivity milegi. No styles confusion — ek single optimised formula covers drag, one-tap & deadshot sab.

---

## Parameters

| Param    | Type   | Required | Values              | Description              |
|----------|--------|----------|---------------------|--------------------------|
| `cores`  | int    | Yes      | 4, 6, 8, 10         | CPU core count           |
| `gpu`    | int    | Yes      | 1, 2, 3, 4          | GPU tier (see below)     |
| `ram`    | float  | Yes      | 2–16                | RAM in GB                |
| `rr`     | float  | Yes      | 60–165              | Refresh rate in Hz       |
| `dpi`    | float  | Yes      | 100–3200            | Touch DPI                |
| `screen` | float  | Yes      | 4.5–7.5             | Screen size in inches    |

### GPU Tiers
```
1 = Low      → IMG GE8320, Mali-G52, Mali-G31
2 = Mid      → Mali-G57, Adreno 610, Mali-G68
3 = High     → Mali-G76, Adreno 618, Adreno 619
4 = Flagship → Adreno 730, Adreno 740, Mali-G710, Immortalis-G715
```

---

## Routes

### GET /
API guide and documentation.

### GET /sensi
Generate sensitivity via query params.

**Example:**
```
GET /sensi?cores=8&gpu=2&ram=4&rr=60&dpi=400&screen=6.0
```

**Response:**
```json
{
  "device": {
    "cores": 8,
    "gpu": 2,
    "gpuLabel": "Mid",
    "ram": 4,
    "refreshRate": 60,
    "dpi": 400,
    "screenInch": 6,
    "score": 47,
    "tier": "Upper-Mid"
  },
  "dpi": {
    "current": 400,
    "recommended": 500,
    "status": "too_low",
    "advice": "DPI 400 is too low. Raise to 500 for smoother tracking."
  },
  "sensitivity": {
    "description": "Optimised headshot sensitivity for your device — covers drag, one-tap & deadshot",
    "values": {
      "general": 112,
      "redDot": 107,
      "scope2x": 102,
      "scope4x": 94,
      "scope8x": 86,
      "awmSniper": 78
    }
  },
  "graphics": {
    "graphics": "Smooth",
    "fps": "Medium",
    "resolution": "HD",
    "shadowQuality": "Low"
  },
  "proTips": [...]
}
```

### POST /sensi
Same as GET but send JSON body.

**Example:**
```bash
curl -X POST https://your-api.vercel.app/sensi \
  -H "Content-Type: application/json" \
  -d '{"cores":8,"gpu":2,"ram":4,"rr":60,"dpi":400,"screen":6.0}'
```

### GET /health
```json
{ "status": "ok", "version": "6.0.0", "uptime": "42s" }
```

---

## Local Setup

```bash
# 1. Clone / copy files
git clone https://github.com/YOUR_USERNAME/ff-sensi-api
cd ff-sensi-api

# 2. Install dependencies
npm install

# 3. Run locally
npm start
# → http://localhost:3000

# Dev mode with auto-reload
npm run dev
```

---

## Vercel Deployment (Free Host)

### Method 1 — Vercel CLI (Recommended)

```bash
# Step 1: Install Vercel CLI
npm install -g vercel

# Step 2: Login
vercel login

# Step 3: Deploy (run inside project folder)
vercel

# Follow prompts:
# ? Set up and deploy? → Y
# ? Which scope? → your account
# ? Link to existing project? → N
# ? Project name → ff-sensi-api
# ? In which directory is your code? → ./
# ✅ Done! URL milegi jaise: https://ff-sensi-api.vercel.app

# Step 4: Production deploy
vercel --prod
```

### Method 2 — GitHub + Vercel Dashboard

```bash
# Step 1: GitHub pe push karo
git init
git add .
git commit -m "FF Sensi API v6.0"
git remote add origin https://github.com/YOUR_USERNAME/ff-sensi-api.git
git push -u origin main

# Step 2: vercel.com pe jao
# → New Project → Import Git Repository
# → ff-sensi-api select karo
# → Framework Preset: Other
# → Deploy button dabao
# ✅ Live URL milegi automatically
```

---

## Example Devices

| Device              | cores | gpu | ram | rr  | dpi | screen |
|---------------------|-------|-----|-----|-----|-----|--------|
| Redmi 9A            | 8     | 1   | 2   | 60  | 400 | 6.53   |
| Redmi Note 11       | 8     | 2   | 4   | 90  | 400 | 6.43   |
| Samsung A53         | 8     | 2   | 6   | 120 | 400 | 6.5    |
| POCO X5 Pro         | 8     | 3   | 8   | 120 | 800 | 6.67   |
| OnePlus 11          | 8     | 4   | 12  | 120 | 800 | 6.7    |
| ASUS ROG Phone 7    | 8     | 4   | 16  | 165 | 800 | 6.78   |

---

## License
MIT — Free to use, modify, host anywhere.
