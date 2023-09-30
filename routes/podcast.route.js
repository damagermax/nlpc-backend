const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const {
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/podcast/category.controller");

const {
  createSeries,
  getCategorySeries,
  getAllSeries,
  getSeries,
  updateSeries,
  deleteSeries,
} = require("../controllers/podcast/series.controller");

const router = express.Router();

/**
 * @access  Private - authenticated users only
 */

router.use(protect);

router.get("/categories", getAllCategory);
router.get("/categories/:id", getCategory);

router.get("/series", getAllSeries);
router.get("/series/:id", getSeries);
router.get("/:categoryId/series", getCategorySeries);

router.get("/:seriesId/episodes");
router.get("/episodes/:id");

/**
 * @access  Private - admin amd publisher only
 */

router.use(authorize("publisher", "admin"));

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.post("/series", createSeries);
router.put("/series/:id", updateSeries);
router.delete("/series/:id", deleteSeries);

router.post("/episodes");
router.put("/episodes/:id");
router.delete("/episodes/:id");

module.exports = router;
