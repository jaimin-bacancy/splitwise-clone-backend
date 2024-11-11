const express = require("express");
const {
  createGroup,
  updateGroup,
  deleteGroup,
  searchGroup,
} = require("../controllers/groupController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.post("/create", createGroup);
router.put("/update/:groupId", updateGroup);
router.delete("/delete/:groupId", deleteGroup);
router.get("/search/", searchGroup);

module.exports = router;
