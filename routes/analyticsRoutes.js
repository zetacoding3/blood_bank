const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const {
  bloodGroupDetailsContoller,
  getStatsController
} = require("../controllers/analyticsController");

const router = express.Router();

//routes

//GET BLOOD DATA
router.get("/bloodGroups-data", authMiddelware, bloodGroupDetailsContoller);

//GET STATS
router.get("/stats", authMiddelware, getStatsController);

module.exports = router;
