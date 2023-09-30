const asyncCatch = require("../../middleware/asyncCatch");

const Category = require("../../models/podcast/Category.model");

const ErrorResponse = require("../../utils/errorResponse");
const { uploadFile, deleteFileFromStorage, FOLDER } = require("../../utils/storage");

exports.createCategory = asyncCatch(async (req, res) => {
  const { name } = req.body;
  const { _id } = req.user;
  const filePath = req?.files[0]?.path;

  let category = new Category({ name, createdBy: _id });

  const result = await uploadFile(filePath, category._id, FOLDER.PODCAST_THUMBNAIL);
  category.thumbnail = result.url;

  await category.save();

  res.status(201).json({ success: true, category });
});

exports.getCategory = asyncCatch(async (req, res) => {
  const { id } = req.params;

  const category = await checkCategoryExistence(id);

  res.json({ success: true, category });
});

exports.getAllCategory = asyncCatch(async (req, res) => {
  const categories = await Category.find();

  res.json({ success: true, count: categories.length, categories });
});

exports.updateCategory = asyncCatch(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const filePath = req?.files[0]?.path;

  const category = await checkCategoryExistence(id);

  const result = await uploadFile(filePath, id, FOLDER.PODCAST_THUMBNAIL);
  result && (category.thumbnail = result.url);

  name && (category.name = name);

  const updateCategory = await category.save();

  res.status(200).json({ success: true, category: updateCategory });
});

exports.deleteCategory = asyncCatch(async (req, res) => {
  const { id } = req.params;

  const category = await checkCategoryExistence(id);

  await category.deleteOne();
  await deleteFileFromStorage(`${FOLDER.PODCAST_THUMBNAIL}/${id}`);

  res.status(200).json({ success: true, message: "Category  was deleted successfully" });
});

/**
 *
 * @param {string} id -
 * @returns  Category
 */

const checkCategoryExistence = async (id) => {
  const category = await Category.findById(id);

  if (!category) throw new ErrorResponse(`Category not found `, 404);

  return category;
};
