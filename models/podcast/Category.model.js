const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["Visible", "Hidden"], default: "Visible" },
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
    file: Object,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

CategorySchema.pre("deleteOne", { document: true, query: true }, async function (next) {
  await this.model("Podcast_Series").deleteMany({ categoryId: this._id });
  next();
});

module.exports = mongoose.model("Podcast_Category", CategorySchema);
