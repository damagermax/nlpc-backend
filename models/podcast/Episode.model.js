const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    note: String,
    part: { type: Number, required: true },
    duration: { type: String, required: true },
    thumbnail: { type: String, required: true },
    audio: { type: String, required: true },
    status: { type: String, enum: ["Visible", "Hidden"], default: "Visible" },
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Podcast_Series", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast_Episode", EpisodeSchema);
