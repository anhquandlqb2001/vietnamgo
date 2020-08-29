const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const topicController = require("../controllers/topicController");
const multerController = require("../controllers/multerController");
const verify_token = require("../middleware/authenticateToken");
const {
  selfPermission,
  adminPermission,
  creatorPermission
} = require("../middleware/authorization");

router.get("/queue/data", verify_token, topicController.topics_listQueue_get);

router.put(
  "/:id/like",
  verify_token,
  topicController.topics_details_likeAction_put
);

router.put(
  "/:id/comments",
  verify_token,
  topicController.topics_details_addComment_put
);

router.put(
  "/update/:id",
  verify_token,
  selfPermission,
  upload.array("imgUpload"),
  multerController.uploadMultipleFiles,
  topicController.topics_details_update_put
);

router.put(
  "/accept/:id",
  verify_token,
  adminPermission,
  topicController.topics_details_accept_put
);

router.get(
  "/edit/:id",
  verify_token,
  topicController.topics_permission,
  topicController.topics_details_edit_get
);

router.get("/favourite", topicController.topics_favourite_get);

router.get("/userpublished", verify_token, topicController.topics_user_published_get);

router.post(
  "/add",
  verify_token,
  creatorPermission,
  upload.array("imgUpload"),
  multerController.uploadMultipleFiles,
  topicController.topics_add_post
);

router.get("/search", topicController.topics_search_get);

router.get("/:id", topicController.topics_details_published_data_get);

router.delete("/:id", verify_token, selfPermission, topicController.topics_details_delete);

router.get("/", topicController.index_get);

module.exports = router;
