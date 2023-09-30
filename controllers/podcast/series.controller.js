const Series = require("../../models/podcast/Series.model");

const asyncCatch = require("../../middleware/asyncCatch");

const ErrorResponse = require("../../utils/errorResponse");
const { uploadFile, deleteFileFromStorage, FOLDER } = require("../../utils/storage");

exports.getCategorySeries = asyncCatch(async (req, res) => {
  const { categoryId } = req.params;

  const series = await Series.find({ categoryId });

  res.status(201).json({ success: true, count: series.length || 0, series });
});

exports.getAllSeries = asyncCatch(async (req, res) => {
  const series = await Series.find().populate("createdBy", "first_name last_name");
  res.status(201).json({ success: true, count: series.length || 0, series });
});

exports.getSeries = asyncCatch(async (req, res) => {
  const { id } = req.params;

  let series = await checkSeriesExistence(id);
  series = await series.populate("createdBy", "first_name last_name");

  res.json({ success: true, series });
});

exports.createSeries = asyncCatch(async (req, res) => {
  const { title, speaker, status, categoryId } = req.body;
  const { _id } = req.user;
  const filepath = req.files ? req.files[0]?.path : null;

  if (!filepath) throw new ErrorResponse("Image is required", 500);

  const series = new Series({ title, speaker, status, categoryId, createdBy: _id });

  const result = await uploadFile(filepath, series._id, FOLDER.PODCAST_THUMBNAIL);
  series.thumbnail = result.url;

  await series.save();

  res.status(201).json({ success: true, series });
});

exports.updateSeries = asyncCatch(async (req, res) => {
  const { title, speaker, status, categoryId } = req.body;
  const { id } = req.params;

  const filePath = req?.files[0]?.path;

  const series = await checkSeriesExistence(id);

  const result = await uploadFile(filePath, id, FOLDER.PODCAST_THUMBNAIL);
  result && (series.thumbnail = result.url);

  title && (series.title = title);
  series && (series.speaker = speaker);
  status && (series.status = status);
  categoryId && (series.categoryId = categoryId);

  const updateSeries = await series.save();

  res.json({ success: true, series: updateSeries });
});

exports.deleteSeries = asyncCatch(async (req, res) => {
  const { id } = req.params;

  const series = await checkSeriesExistence(id);

  await deleteFileFromStorage(`${FOLDER.PODCAST_THUMBNAIL}/${id}`);
  await series.deleteOne();

  res.json({ success: true, message: `${series.title} deleted successfully` });
});

const checkSeriesExistence = async (id) => {
  const series = await Series.findById(id);

  if (!series) throw new ErrorResponse("Series not found", 401);

  return series;
};
