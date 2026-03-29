const mongoose = require("mongoose");

const SenciSchema = new mongoose.Schema({
    ios: { type: String, default: "https://apple.com" },
    paid: { type: String, default: "https://paidlink.com" },
    desktop: { type: String, default: "https://desktoplink.com" }
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

module.exports = {
    Senci: mongoose.model("Senci", SenciSchema),
    Vote: mongoose.model("Vote", VoteSchema),
    Slider: mongoose.model("Slider", SliderSchema)
};
