const idea = require("../models/ideas");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getUserById } = require("../controllers/user.controller");

exports.getideaById = (req, res, next, Id) => {
  idea.findById(Id)
    .populate("user upvotes.user comments.user")
    .exec((err, idea) => {
      if (err) {
        return res.status(400).json({
          errorMsg: "An error occured",
        });
      }
      if (!idea) {
        return res.status(400).json({
          errorMsg: "idea not found",
        });
      }
      idea.user.salt = undefined;
      idea.user.encryptedpassword = undefined;
      req.ideas = idea;
      next();
    });
};

fs.mkdir("uploads", (err) => {
  if (err) {
  }
  fs.mkdir("uploads/ideas", (err) => {
    if (err) {
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ideas");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "idea_" +
        new Date(Date.now())
          .toISOString()
          .replace(/-|:|Z|\./g, "")
          .replace(/T/g, "_") +
        path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
exports.upload = multer({ storage: storage, fileFilter: fileFilter });

//create idea
exports.createidea = (req, res) => {
  const { user, title, link } = req.body;
  var picture;
  if (req.file) {
    picture = req.file.path;
  }
  const newidea = idea({ user, title, link, picture });
  newidea.save((err, idea) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      });
    }
    return res.status(200).json(idea);
  });
};

// read all ideas
exports.allideas = (req, res) => {
  idea.find()
    .populate("user upvotes.user comments.user")
    .sort({ createdAt: -1 })
    .exec((err, ideas) => {
      if (err) {
        res.status(400).json({
          errorMsg: "An error occured",
        });
      }

      ideas.map((idea) => {
        idea.user.salt = undefined;
        idea.user.encryptedpassword = undefined;
      });
      return res.json(ideas);
    });
};

//Read a particular idea
exports.getidea = (req, res) => {
  idea.find({ _id: req.ideas._id }).exec((err, idea) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      });
    }
    return res.json(idea);
  });
};

// update idea
exports.updateidea = (req, res) => {
  idea.findById({ _id: req.ideas._id }).exec((err, idea) => {
    if (idea.picture) {
      let path = idea.picture;
      fs.readdir(path, (err, files) => {
        if (path) {
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    }
  });
  const { user, title, link } = req.body;
  var picture;
  if (req.file) {
    picture = req.file.path;
  }
  const updateObj = { user, title, link, picture };

  idea.findByIdAndUpdate(
    { _id: req.ideas._id },
    { $set: updateObj },
    { useFindAndModify: false, new: true },
    (err, idea) => {
      if (err || !idea) {
        return res.status(400).json({
          error: "An error occured,  try again later",
        });
      }
      return res.status(200).json(idea);
    }
  );
};

// delete idea
exports.deleteidea = (req, res) => {
  idea.findById({ _id: req.ideas._id }).exec((err, idea) => {
    if (idea.picture) {
      let path = idea.picture;
      fs.readdir(path, (err, files) => {
        if (path) {
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    }
  });
  idea.findByIdAndRemove(
    { _id: req.ideas._id },
    { useFindAndModify: false, new: true },
    (err, idea) => {
      if (err || !idea) {
        return res.status(400).json({
          error: "An error occured,  try again later",
        });
      }
      return res.status(200).json({ message: "idea has been deleted" });
    }
  );
};

// Upvote a idea
exports.upvoteidea = (req, res) => {
  idea.findByIdAndUpdate(
    { _id: req.ideas._id },
    {
      $push: { upvotes: req.profile._id },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  ).exec((err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    } else {
      res.status(200).json(result);
    }
  });
};

// Downvote a idea
exports.downvoteidea = (req, res) => {
  idea.findByIdAndUpdate(
    { _id: req.ideas._id },
    {
      $pull: { upvotes: req.profile._id },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  ).exec((err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    } else {
      res.status(200).json(result);
    }
  });
};

// comment on a idea
exports.commentidea = (req, res) => {
  idea.findByIdAndUpdate(
    { _id: req.ideas._id },
    {
      $push: {
        comments: { user: req.profile._id, text: req.body.text },
      },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.countShareidea = (req, res) => {
  idea.findById({ _id: req.ideas._id }).exec((err, idea) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    }

    idea.shareCount++;
    idea.save();
    res.json(idea);
  });
};

exports.getAllideaByUser = (req, res) => {
  idea.find({ user: req.profile._id })
    .populate("user upvotes.user comments.user")
    .sort({ createdAt: -1 })
    .exec((err, ideas) => {
      if (err) {
        return res
          .json(400)
          .json({ errorMsg: "An error occured, try again later" });
      }
      res.status(200).json(ideas);
    });
};
