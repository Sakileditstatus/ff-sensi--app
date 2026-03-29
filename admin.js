const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Senci, Vote, Slider } = require("./models");

// 1. GET ALL DATA (Dashboard Overview)
router.get("/all", async (req, res) => {
    try {
        const links = await Senci.findOne();
        const sliders = await Slider.find();
        const votes = await Vote.find();
        
        const working = votes.filter(v => v.voteType === 'working').length;
        const total = votes.length;

        res.json({
            links,
            sliders,
            votes: {
                total,
                working,
                notWorking: total - working,
                workingPercent: total > 0 ? (working / total * 100).toFixed(1) + "%" : "0%"
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. UPDATE LINKS
router.post("/update-links", async (req, res) => {
    const { ios, paid, desktop } = req.body;
    try {
        let config = await Senci.findOne();
        if (!config) config = new Senci();
        
        if (ios) config.ios = ios;
        if (paid) config.paid = paid;
        if (desktop) config.desktop = desktop;
        
        await config.save();
        res.json({ message: "✅ Links updated successfully", config });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ADD SLIDER
router.post("/slider/add", async (req, res) => {
    try {
        const newSlider = new Slider(req.body);
        await newSlider.save();
        res.json({ message: "✅ Slider added", slider: newSlider });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE SLIDER
router.post("/slider/update", async (req, res) => {
    const { id, ...updateData } = req.body;
    try {
        const updated = await Slider.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ message: "✅ Slider updated", slider: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE SLIDER
router.post("/slider/delete", async (req, res) => {
    const { id } = req.body;
    try {
        await Slider.findByIdAndDelete(id);
        res.json({ message: "🗑️ Slider deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. RESET VOTES
router.post("/reset-votes", async (req, res) => {
    try {
        await Vote.deleteMany({});
        res.json({ message: "🧹 All votes cleared!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
