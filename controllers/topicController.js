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
    if (req.query.role === "admin") {
      TopicModel.find({ status: "queue" }, (err, result) => {
        if (err) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true, result });
      });
    } else {
      TopicModel.find({ status: "queue", userID: req.query.id }, (err, result) => {
        if (err) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true, result });
      });
    }
  }

  topics_queue_get(req, res) {
    var response;
    if (req.query.role === "admin") {
      TopicModel.find({ status: "queue" }).then((topics) => {
        response = {
          tops: topics.map((topic) => {
            return {
              title: topic.title,
              address_pri: topic.address_pri,
              address_sec: topic.address_sec,
              description: topic.description,
              body: topic.body,
              coor: topic.coor,
              imageURL: topic.imageURL,
              date: topic.date.toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
              }),
              _id: topic._id,
              watched: topic.watched,
              userID: topic.userID,
              status: topic.status,
              request: {
                type: "GET",
                url: "http://localhost:5000/topics/" + topic._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      });
    } else {
      TopicModel.find({ status: "queue", userID: req.query.id }).then(
        (topics) => {
          response = {
            tops: topics.map((topic) => {
              return {
                title: topic.title,
                address_pri: topic.address_pri,
                address_sec: topic.address_sec,
                description: topic.description,
                body: topic.body,
                coor: topic.coor,
                imageURL: topic.imageURL,
                date: topic.date.toLocaleString("en-US", {
                  timeZone: "Asia/Ho_Chi_Minh",
                }),
                _id: topic._id,
                watched: topic.watched,
                userID: topic.userID,
                status: topic.status,
                request: {
                  type: "GET",
                  url: "http://localhost:5000/topics/" + topic._id,
                },
              };
            }),
          };
          res.status(200).json(response);
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
        comments: [],
      });

      const topic = await newTopic.save();
      return res.json({ success: true, message: "Them bai viet thanh cong" });
    } catch (error) {
      res.json({ success: false, error });
    }
  }

  topics_user_published_get(req, res) {
    let _id = req.query.id;
    TopicModel.find({ userID: _id, status: "published" }, (e, result) => {
      res.json({ status: true, result });
    });
  }

  async topics_details_get(req, res) {
    let _id = req.query.id;
    let id = req.params.id;
    let topic = await TopicModel.findById(id);
    let user = await UserModel.findById(topic.userID);

    if (topic.status === "published") {
      if (!req.query.action) {
        try {
          topic.watched += 1;
          await topic.save();

          let location = await LocationModel.find(
            { address: topic.address_pri },
            async (e, result) => {
              result[0].totalWatch += 1;
              await result[0].save();
              res.json({ status: true, topic, username: user.username });
            }
          );
        } catch (e) {}
      }
      if (req.query.action === "getComment") {
        try {
          topic.comments.sort(function (a, b) {
            return new Date(b.time) - new Date(a.time);
          });

          res.json({ status: true, topic, username: user.username });
        } catch (e) {
          res.status(400);
        }
      }
    } else {
      if (
        req.query.role == "admin" ||
        (req.query.role === "creator" && topic.userID == _id)
      ) {
        if (!req.query.action) {
          res.json({ status: true, topic, username: user.username });
        }
        if (req.query.action === "getComment") {
          try {
            topic.comments.sort(function (a, b) {
              return new Date(b.time) - new Date(a.time);
            });

            res.json({ status: true, topic, username: user.username });
          } catch (e) {
            res.status(400);
          }
        }
      } else {
        return res.json({ status: false, message: "Khong du quyen" });
      }
    }
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

  // async topics_details_post(req, res) {
  //   let id = req.params.id;
  //   let topic = await TopicModel.findById(id);
  //   if (req.body.likeAction && req.body.like == "false") {
  //     topic.like = [...topic.like, req.body.userID];
  //     await topic.save();
  //     res.json({ success: true, countLike: topic.like.length });
  //   } else if (req.body.likeAction) {
  //     topic.like.splice(topic.like.indexOf(req.body.userID), 1);
  //     await topic.save();
  //     res.json({ success: true, countLike: topic.like.length });
  //   } else {
  //     var newComment = req.body;
  //     newComment.time = new Date().toLocaleString("en-US", {
  //       timeZone: "Asia/Ho_Chi_Minh",
  //     });

  //     try {
  //       topic.comments = [...topic.comments, newComment];
  //       await topic.save();
  //       topic.comments.sort(function (a, b) {
  //         // Turn your strings into dates, and then subtract them
  //         // to get a value that is either negative, positive, or zero.
  //         return new Date(b.time) - new Date(a.time);
  //       });
  //       res.json(topic.comments);
  //     } catch (error) {}
  //   }
  // }

  async topics_details_likeAction_put(req, res) {
    // just topics published
    try {
      const topic = await TopicModel.findById(req.params.id);
      if (topic.status === "queue") {
        return res.json({ success: false });
      }
      if (!topic.like.includes(req.body.userID)) {
        topic.like = [...topic.like, req.body.userID];
      } else {
        const index = topic.like.indexOf(req.body.userID);
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
    if (req.query.role == "admin") {
      next();
    } else if (
      req.query.role == "creator" &&
      req.query.userID == req.query.userIDDelete
    ) {
      next();
    } else {
      res.json({ status: false, message: "Bạn không có quyền truy cập" });
    }
  }

  async topics_details_accept_put(req, res) {
    try {
      // const topic = await TopicModel.findById(req.params.id);
      // topic.status = "published";
      // await topic.save();
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
