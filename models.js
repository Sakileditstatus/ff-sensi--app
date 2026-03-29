const mongoose = require("mongoose");

const SenciSchema = new mongoose.Schema({
    ios: { type: String, default: "https://apple.com" },
    paid: { type: String, default: "https://paidlink.com" },
    desktop: { type: String, default: "https://desktoplink.com" },
    hits: { type: Number, default: 0 }
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

module.exports = {
    Senci: mongoose.models.Senci || mongoose.model("Senci", SenciSchema),
    Vote: mongoose.models.Vote || mongoose.model("Vote", VoteSchema),
    Slider: mongoose.models.Slider || mongoose.model("Slider", SliderSchema),
    Device: mongoose.models.Device || mongoose.model("Device", DeviceSchema)
};
