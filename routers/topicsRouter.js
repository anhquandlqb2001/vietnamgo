const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const topicController = require("../controllers/topicController");
const multerController = require("../controllers/multerController");

router.get("/queue/data", topicController.topics_listQueue_get);

router.put("/:id/like", topicController.topics_details_likeAction_put);

router.put("/:id/comments", topicController.topics_details_addComment_put);

router.put(
  "/update/:id",
  upload.array("imgUpload"),
  multerController.uploadMultipleFiles,
  topicController.topics_details_update_put
);

router.put("/accept/:id", topicController.topics_details_accept_put);

router.get(
  "/edit/:id",
  topicController.topics_permission,
  topicController.topics_details_edit_get
);

router.get("/favourite", topicController.topics_favourite_get);

router.get("/userpublished", topicController.topics_user_published_get);

router.post(
  "/add",
  upload.array("imgUpload"),
  multerController.uploadMultipleFiles,
  topicController.topics_add_post
);

router.get("/search", topicController.topics_search_get);

router.get("/:id", topicController.topics_details_published_data_get);

router.delete("/:id", topicController.topics_details_delete);

router.get("/", topicController.index_get);

module.exports = router;
