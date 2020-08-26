const express = require("express");
const User = require("../models/user.models");
const Topic = require("../models/topic.models");
const router = express.Router();
const Location = require("../models/location.models");

const cloudinary = require("cloudinary").v2.api;
const upload = require("../config/modelMulter");

const self = require("../config/multerconfig");

router.get("/", (req, res) => {
  const sortOption =
    req.query.sortby !== "undefined" ? req.query.sortby : "date";
  Topic.find({ status: "published" }).then((topics) => {
    switch (sortOption) {
      case "date":
        topics.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;
      case "watch":
        topics.sort((a, b) => {
          return b.watched - a.watched;
        });
        break;
      case "like":
        topics.sort((a, b) => {
          return b.like.length - a.like.length;
        });
        break;
      default:
        break;
    }

    const response = {
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
            url: "http://localhost:5000/api/topics/" + topic._id,
          },
        };
      }),
    };
    res.status(200).json(response);
  });
});

router.get("/favourite", (req, res) => {
  const topic = Topic.find({}, (e, result) => {
    result.sort((a, b) => b.like.length - a.like.length);
    const data = result.splice(0, 4);
    res.json({ topics: data });
  });
});

router.get("/queue", (req, res) => {
  var response;
  if (req.query.role === "admin") {
    Topic.find({ status: "queue" }).then((topics) => {
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
    Topic.find({ status: "queue", userID: req.query.id }).then((topics) => {
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
  }
});

router.get("/search", async (req, res) => {
  const sortOption =
    req.query.sortby !== "undefined" ? req.query.sortby : "date";
  const addressFind = req.query.address;
  Topic.find({ status: "published", address_pri: addressFind }).then(
    (topics) => {
      switch (sortOption) {
        case "date":
          topics.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          break;
        case "watch":
          topics.sort((a, b) => {
            return b.watched - a.watched;
          });
          break;
        case "like":
          topics.sort((a, b) => {
            return b.like.length - a.like.length;
          });
          break;
        default:
          break;
      }

      const response = {
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
              url: "http://localhost:5000/api/topics/" + topic._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    }
  );
});

router.post(
  "/add",
  upload.array("imgUpload"),
  self.uploadMultipleFiles,
  async (req, res) => {
    try {
      const newTopic = new Topic({
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
);

router.get("/userpublished", async (req, res) => {
  let _id = req.query.id;

  let topics = await Topic.find(
    { userID: _id, status: "published" },
    (e, result) => {
      res.json({ status: true, result });
    }
  );
});

router.get("/:id", async (req, res) => {
  let _id = req.query.id;
  let id = req.params.id;
  let topic = await Topic.findById(id);
  let user = await User.findById(topic.userID);

  if (topic.status === "published") {
    if (!req.query.action) {
      try {
        topic.watched += 1;
        await topic.save();

        let location = await Location.find(
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
});

router.post("/:id", async (req, res) => {
  let id = req.params.id;
  let topic = await Topic.findById(id);
  if (req.body.likeAction && req.body.like == "false") {
    topic.like = [...topic.like, req.body.userID];
    await topic.save();
    res.json({ success: true, countLike: topic.like.length });
  } else if (req.body.likeAction) {
    topic.like.splice(topic.like.indexOf(req.body.userID), 1);
    await topic.save();
    res.json({ success: true, countLike: topic.like.length });
  } else {
    var newComment = req.body;
    newComment.time = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    try {
      topic.comments = [...topic.comments, newComment];
      await topic.save();
      topic.comments.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.time) - new Date(a.time);
      });
      res.json(topic.comments);
    } catch (error) {}
  }
});

const removeImageOnCloud = (Public_Ids) => {
  cloudinary.delete_resources(Public_Ids, (error, result) => {
    console.log(result);
  });
};

router.delete("/:id", checkPermission, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    removeImageOnCloud(
      topic.imageURL.map((img) => {
        return img.id;
      })
    );
    await topic.remove();
    res.json({ success: true, message: `Deleted ${req.params.id}` });
  } catch (e) {
    res.json({success: false, e})
  }
});

router.get("/edit/:id", checkPermission, async (req, res) => {
  let topic;
  try {
    topic = await Topic.findById(req.params.id);
    res.json(topic);
  } catch (error) {}
});

function checkPermission(req, res, next) {
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

router.post("/accept/:id", async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  topic.status = "published";
  await topic.save();
});

router.post(
  "/update/:id",
  upload.array("imgUpload"),
  self.uploadMultipleFiles,
  async (req, res) => {
    try {
      let topic = await Topic.findById(req.params.id);
      removeImageOnCloud(
        topic.imageURL.map((img) => {
          return img.id;
        })
      );
      topic.title = req.body.title;
      topic.address_pri = req.body.address_pri;
      topic.address_sec = req.body.address_sec;
      topic.coor = [req.body.coorx, req.body.coory];
      topic.description = req.body.description;
      topic.body = req.body.body;
      topic.imageURL = req.imageArray;

      await topic.save();
      return res.json({ success: true, message: "Cap nhat thanh cong" });
    } catch (error) {
      res.json({ success: false, error });
    }
  }
);

module.exports = router;
