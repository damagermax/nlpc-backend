const mongoose = require("mongoose");

const SeriesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    speaker: String,
    thumbnail: { type: String, required: true },
    status: { type: String, enum: ["Visible", "Hidden"], default: "Visible" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Podcast_Category", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast_Series", SeriesSchema);
