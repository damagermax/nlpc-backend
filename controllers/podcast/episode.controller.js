const asyncCatch = require("../../middleware/asyncCatch");

const Episode = require("../../models/podcast/Episode.model");

const ErrorResponse = require("../../utils/errorResponse");
const { uploadFile, deleteFileFromStorage, FOLDER } = require("../../utils/storage");

exports.createEpisode = asyncCatch(async (req, res) => {
  const { title, note, description, part, duration, seriesId } = req.body;
  const userId = req.user._id;

  let episode = new Episode({ title, note, description, part, duration, seriesId });

  episode = await uploadEpisodeThumbnailAndAudio(episode, req);

  episode.createdBy = userId;

  await episode.save();

  res.status(201).json({ success: true, episode });
});

exports.getAllSeriesEpisode = asyncCatch(async (req, res) => {
  const { seriesId } = req.params;

  const episodes = await Episode.find({ seriesId });

  res.json({ success: true, count: episodes.length, episodes });
});

exports.getEpisode = asyncCatch(async (req, res) => {
  const { id } = req.params;
  const episode = checkEpisodeExistence(id);

  res.json({ success: true, episode });
});

exports.updateEpisode = asyncCatch(async (req, res) => {
  const { id } = req.params;
  const { title, note, description, part, duration } = req.body;

  let episode = checkEpisodeExistence(id);

  episode = await uploadEpisodeThumbnailAndAudio(episode, req);

  note && (episode.note = note);
  part && (episode.part = part);
  title && (episode.title = title);
  duration && (episode.duration = duration);
  description && (episode.description = description);

  await episode.save();

  res.json({ success: true, episode });
});

exports.deleteEpisode = asyncCatch(async (req, res) => {
  const { id } = req.params;

  const episode = checkEpisodeExistence(id);

  await Promise.all([
    deleteFileFromStorage(`${FOLDER.PODCAST_AUDIO}/${id}`),
    deleteFileFromStorage(`${FOLDER.PODCAST_THUMBNAIL}/${id}`),
  ]);

  await episode.deleteOne(),
    res.json({ success: true, message: `${episode.title} deleted successfully` });
});

const checkEpisodeExistence = async (id) => {
  const episode = await Episode.findById(id);

  if (!episode) throw new ErrorResponse(`Category not found `, 404);

  return episode;
};

const uploadEpisodeThumbnailAndAudio = async (episode, req) => {
  const thumbnailFilePath = req.files[0].path ?? null;
  const audioFilePath = req.files[1].path ?? null;

  const episodeId = episode._id;

  const thumbnailResult = await uploadFile(thumbnailFilePath, episodeId, FOLDER.PODCAST_THUMBNAIL);
  const audioResult = await uploadFile(audioFilePath, episodeId, FOLDER.PODCAST_AUDIO);

  audioResult && (episode.audio = audioResult.url);
  thumbnailResult && (episode.thumbnail = thumbnailResult.url);

  return episode;
};
