const mongoose = require("mongoose");

const SenciSchema = new mongoose.Schema({
    ios: { type: String, default: "https://apple.com" },
    paid: { type: String, default: "https://paidlink.com" },
    desktop: { type: String, default: "https://desktoplink.com" },
    hits: { type: Number, default: 0 },
    tip1: { type: String, default: "AI Analysis: AI optimized headshot settings." },
    tip2: { type: String, default: "Fire Button: Set size at 45% for perfect drag." },
    tip3: { type: String, default: "Practice: 1-2 hours training ground for result." },
    tip4: { type: String, default: "Paid Sensi: Tap for VIP Premium settings." }
});

const VoteSchema = new mongoose.Schema({
    deviceId: { type: String, unique: true },
    voteType: { type: String, enum: ['working', 'not_working'] }
});

const SliderSchema = new mongoose.Schema({
    image_url: String,
    title: String,
    subtitle: String,
    badge: String,
    button_text: String,
    button_url: String
});

const DeviceSchema = new mongoose.Schema({
    deviceId: { type: String, unique: true },
    lastVisit: { type: Date, default: Date.now }
});

const DialogSchema = new mongoose.Schema({
    title: { type: String, default: "New Update Available" },
    message: { type: String, default: "Please download the latest version for the best experience." },
    btn1Name: { type: String, default: "Download" },
    btn1Link: { type: String, default: "" },
    btn2Name: { type: String, default: "Later" },
    btn2Link: { type: String, default: "" },
    isCancelable: { type: Boolean, default: true },
    targetVersions: { type: [String], default: [] }, // Empty = All Versions
    active: { type: Boolean, default: false }
});

const ShortLinkSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    Senci: mongoose.models.Senci || mongoose.model("Senci", SenciSchema),
    Vote: mongoose.models.Vote || mongoose.model("Vote", VoteSchema),
    Slider: mongoose.models.Slider || mongoose.model("Slider", SliderSchema),
    Device: mongoose.models.Device || mongoose.model("Device", DeviceSchema),
    Dialog: mongoose.models.Dialog || mongoose.model("Dialog", DialogSchema),
    ShortLink: mongoose.models.ShortLink || mongoose.model("ShortLink", ShortLinkSchema)
};
