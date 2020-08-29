const UserModel = require("../models/user.models");
const TopicModel = require("../models/topic.models");
const LocationModel = require("../models/location.models");
const cloudinary = require("cloudinary").v2.api;

class TopicController {
  index_get(req, res) {
    TopicModel.find({ status: "published" }, (err, result) => {
      if (err) {
        return res.json({ success: false, err });
      }
      return res.json({ success: true, result });
    });
  }

  topics_favourite_get(req, res) {
    TopicModel.find({})
      .limit(3)
      .sort({ like: -1 })
      .exec((err, result) => {
        res.json({ success: true, result });
      });
  }

  topics_listQueue_get(req, res) {
    if (req.user.role === "admin") {
      TopicModel.find({ status: "queue" }, (err, result) => {
        if (err) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true, result });
      });
    } else if (req.user.role === "creator") {
      TopicModel.find(
        { status: "queue", userID: req.user.userID },
        (err, result) => {
          if (err) {
            return res.json({ success: false, err });
          }
          return res.json({ success: true, result });
        }
      );
    }
  }

  
  topics_search_get(req, res) {
    TopicModel.find(
      { status: "published", address_pri: req.query.address },
      (err, result) => {
        if (err) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true, result });
      }
    );
  }

  async topics_add_post(req, res) {
    try {
      const newTopic = new TopicModel({
        title: req.body.title,
        address_pri: req.body.address_pri,
        address_sec: req.body.address_sec,
        description: req.body.description,
        body: req.body.body,
        imageURL: req.imageArray,
        coor: [req.body.coorx, req.body.coory],
        watched: req.body.watched,
        userID: req.body.id,
        author: req.body.author,
        comments: [],
      });

      const topic = await newTopic.save();
      return res.json({ success: true, message: "Them bai viet thanh cong" });
    } catch (error) {
      res.json({ success: false, error });
    }
  }

  topics_user_published_get(req, res) {
    TopicModel.find({ userID: req.user.userID, status: "published" }, (e, result) => {
      res.json({ status: true, result });
    });
  }

  
  topics_details_published_data_get(req, res) {
    TopicModel.findById(req.params.id, (err, result) => {
      if (err) {
        return res.json({ success: false, err });
      }
      if (result.status === "queue" && req.query.role !== "admin") {
        return res.json({ success: false });
      }

      result.comments.sort(function (a, b) {
        return new Date(b.time) - new Date(a.time);
      });
      if (result.like.includes(req.query.userID)) {
        result = { ...result._doc, liked: true };
      }
      return res.json({ success: true, result });
    });
  }

  async topics_details_likeAction_put(req, res) {
    // just topics published
    try {
      const topic = await TopicModel.findById(req.params.id);
      if (topic.status === "queue") {
        return res.json({ success: false });
      }
      if (!topic.like.includes(req.user.userID)) {
        topic.like = [...topic.like, req.user.userID];
      } else {
        const index = topic.like.indexOf(req.user.userID);
        if (index > -1) {
          topic.like.splice(index, 1);
        }
      }
      await topic.save();
      return res.json({ success: true, countLike: topic.like.length });
    } catch (error) {
      console.log(error);
    }
  }
  async topics_details_addComment_put(req, res) {
    const newComment = req.body;
    newComment.time = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    try {
      const topic = await TopicModel.findOne({ _id: req.params.id });
      if (topic.status === "queue") {
        return res.json({ success: false });
      }
      newComment.username = req.user.username;
      newComment.userID = req.user.userID;
      topic.comments = [...topic.comments, newComment];
      await topic.save();
      res.json({ success: true, newComment });
    } catch (error) {
      console.log(error);
    }
  }

  async topics_details_delete(req, res) {
    try {
      const topic = await TopicModel.findById(req.params.id);
      removeImageOnCloud(
        topic.imageURL.map((img) => {
          return img.id;
        })
      );
      await topic.remove();
      res.json({ success: true, message: `Deleted ${req.params.id}` });
    } catch (e) {
      res.json({ success: false, e });
    }
  }

  async topics_details_edit_get(req, res) {
    try {
      const topic = await TopicModel.findById(req.params.id);
      res.json(topic);
    } catch (error) {}
  }

  topics_permission(req, res, next) {
    if (req.user.role == "admin") {
      return next();
    } else if (req.user.role === "creator") {
      TopicModel.findById(req.params.id, (err, result) => {
        if (err) return res.status(404);
        if (req.user.userID === result.userID) {
          return next()
        }
        return res.json({success: false})
      });
    } else {
      return res.status(403)
    }
  }

  async topics_details_accept_put(req, res) {
    try {
      TopicModel.findByIdAndUpdate(
        req.params.id,
        { status: "published" },
        (err, result) => {
          if (err) {
            return res.json({ success: false, err });
          }
          return res.json({ success: true });
        }
      );
    } catch (error) {}
  }

  async topics_details_update_put(req, res) {
    try {
      const topic = await TopicModel.findById(req.params.id);
      topic.title = req.body.title;
      topic.address_pri = req.body.address_pri;
      topic.address_sec = req.body.address_sec;
      topic.coor = [req.body.coorx, req.body.coory];
      topic.description = req.body.description;
      topic.body = req.body.body;
      if (req.imageArray.length > 0) {
        removeImageOnCloud(
          topic.imageURL.map((img) => {
            return img.id;
          })
        );
        topic.imageURL = req.imageArray;
      }

      await topic.save();
      return res.json({ success: true, message: "Cap nhat thanh cong" });
    } catch (error) {
      res.json({ success: false, error });
    }
  }
}

const removeImageOnCloud = (Public_Ids) => {
  cloudinary.delete_resources(Public_Ids, (error, result) => {
    console.log(result);
  });
};

module.exports = new TopicController();
