const cloudinary = require("cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

cloudinary.config({
  cloud_name: "dh5pvzxlw",
  api_key: "845924781431127",
  api_secret: "tE2mN3j5wV_h0Sog1qLJyo9Dbxk",
});

exports.uploadFile = async (filePath, id, folder) => {
  if (!id || !filePath || !folder) return;

  const result = await cloudinary.v2.uploader.upload(filePath, {
    folder: folder,
    public_id: id,
    resource_type: "auto",
    invalidate: true,
    overwrite: true,
  });

  return result;
};

exports.deleteFileFromStorage = async (id) => {
  const result = await cloudinary.v2.api.delete_resources(id, {
    type: "upload",
  });
  return result;
};

exports.FOLDER = {
  PODCAST_THUMBNAIL: "podcast/thumbnail",
  PODCAST_NOTE: "podcast/note",
  PODCAST_AUDIO: "podcast/audio",
  USER: "user",
};
