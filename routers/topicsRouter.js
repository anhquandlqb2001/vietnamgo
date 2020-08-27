const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig")
const topicController = require("../controllers/topicController");
const multerController = require("../controllers/multerController");

router.post("/update/:id", upload.array("imgUpload"), multerController.uploadMultipleFiles)

router.post("/accept/:id", topicController.topics_details_accept_post)

router.get("/edit/:id", topicController.topics_permission, topicController.topics_details_edit_get)

router.get("/favourite", topicController.topics_favourite_get);

router.get("/userpublished", topicController.topics_user_published_get)

router.post(
  "/add",
  upload.array("imgUpload"),
  multerController.uploadMultipleFiles,
  topicController.topics_add_post
);

router.get("/queue", topicController.topics_queue_get);

router.get("/search", topicController.topics_search_get);

router.delete("/:id", topicController.topics_details_delete)

router.post("/:id", topicController.topics_details_post)

router.get("/:id", topicController.topics_details_get)

router.get("/", topicController.index_get);


module.exports = router;
