const express = require("express");
const User = require("../models/user.models");
const Topic = require("../models/topic.models");
const router = express.Router();
const uploadController = require("../controller/upload.js");
const updateController = require("../controller/update.js");
const Location = require("../models/location.models");
const fs = require("fs");

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
          return b.totalWatch - a.totalWatch;
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
          date: topic.date,
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
          date: topic.date,
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
            return b.totalWatch - a.totalWatch;
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

router.post("/add", uploadController.uploadFiles);

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let topic = await Topic.findById(id);
  let user = await User.findById(topic.userID);
  if (!req.query.action) {
    try {
      topic.watched += 1;
      await topic.save();

      let location = await Location.find(
        { address: topic.address_pri },
        async (e, result) => {
          result[0].totalWatch += 1;
          await result[0].save();
          res.json({ topic, username: user.username });
        }
      );
    } catch (e) {}
  } else {
    try {
      topic.comments.sort(function (a, b) {
        return new Date(b.time) - new Date(a.time);
      });

      res.json({ topic, username: user.username });
    } catch (e) {
      res.status(400);
    }
  }
});

router.post("/:id", async (req, res) => {
  let id = req.params.id;
  let topic = await Topic.findById(id);
  console.log(req.body);
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

router.delete("/:id", checkPermission, async (req, res) => {
  let topic;
  try {
    topic = await Topic.findById(req.params.id);
    for (let index = 0; index < topic.imageURL.length; index++) {
      const path = topic.imageURL[index].filename;
      fs.unlink(`public/uploads/${path}`, (e) => {
        if (e) {
          throw e;
        }
      });
    }
    await topic.remove();
    res.json(`Deleted ${req.params.id}`);
  } catch (e) {
    console.log(e);
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

router.post("/update/:id", updateController.updateFiles);

module.exports = router;
