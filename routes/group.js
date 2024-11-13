const express = require("express");
const {
  createGroup,
  updateGroup,
  joinGroup,
  deleteGroup,
  searchGroup,
  removeUserGroup,
  groupDetail,
} = require("../controllers/groupController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.post("/create", createGroup);
router.get("/:groupId/detail", groupDetail);
router.put("/update/:groupId", updateGroup);
router.put("/join/:uniqueCode", joinGroup);
router.delete("/delete/:groupId", deleteGroup);
router.delete("/delete/:groupId/user/:userId", removeUserGroup);
router.get("/search/", searchGroup);

module.exports = router;
