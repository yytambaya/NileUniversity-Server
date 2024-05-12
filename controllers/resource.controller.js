const Resource = require("../models/Resource");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getUserById } = require("../controllers/user.controller");

exports.getResourceById = (req, res, next, Id) => {
  Resource.findById(Id)
    .populate("user upvotes.user comments.user")
    .exec((err, resource) => {
      if (err) {
        return res.status(400).json({
          errorMsg: "An error occured",
        });
      }
      if (!resource) {
        return res.status(400).json({
          errorMsg: "resource not found",
        });
      }
      resource.user.salt = undefined;
      resource.user.encryptedpassword = undefined;
      req.resources = resource;
      next();
    });
};

fs.mkdir("uploads", (err) => {
  if (err) {
  }
  fs.mkdir("uploads/resources", (err) => {
    if (err) {
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resources");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "resource_" +
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

//create resource
exports.createResource = (req, res) => {
  const { user, title, link } = req.body;
  var picture;
  if (req.file) {
    picture = req.file.path;
  }
  const newResource = Resource({ user, title, link, picture });
  newResource.save((err, resource) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      });
    }
    return res.status(200).json(resource);
  });
};

// read all resources
exports.allResources = (req, res) => {
  Resource.find()
    .populate("user upvotes.user comments.user")
    .sort({ createdAt: -1 })
    .exec((err, resources) => {
      if (err) {
        res.status(400).json({
          errorMsg: "An error occured",
        });
      }

      resources.map((resource) => {
        resource.user.salt = undefined;
        resource.user.encryptedpassword = undefined;
      });
      console.log(resources)
      return res.json(resources);
    });
};

//Read a particular resource
exports.getResource = (req, res) => {
  Resource.find({ _id: req.resources._id }).exec((err, resource) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      });
    }
    return res.json(resource);
  });
};

// update resource
exports.updateResource = (req, res) => {
  Resource.findById({ _id: req.resources._id }).exec((err, resource) => {
    
  });
  const { user, title, link } = req.body;
  
  const updateObj = { user, title, link };

  Resource.findByIdAndUpdate(
    { _id: req.resources._id },
    { $set: updateObj },
    { useFindAndModify: false, new: true },
    (err, resource) => {
      if (err || !resource) {
        return res.status(400).json({
          error: "An error occurred,  try again later",
        });
      }
      return res.status(200).json(resource);
    }
  );
};

// delete resource
exports.deleteResource = (req, res) => {
  Resource.findById({ _id: req.resources._id }).exec((err, resource) => {
    /*if (resource.picture) {
      let path = resource.picture;
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
    }*/
  });
  Resource.findByIdAndRemove(
    { _id: req.resources._id },
    { useFindAndModify: false, new: true },
    (err, resource) => {
      if (err || !resource) {
        return res.status(400).json({
          error: "An error occured,  try again later",
        });
      }
      return res.status(200).json({ message: "resource has been deleted" });
    }
  );
};

// Upvote a resource
exports.upvoteResource = (req, res) => {
  Resource.findByIdAndUpdate(
    { _id: req.resources._id },
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

// Downvote a resource
exports.downvoteResource = (req, res) => {
  Resource.findByIdAndUpdate(
    { _id: req.resources._id },
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

// comment on a resource
exports.commentResource = (req, res) => {
  Resource.findByIdAndUpdate(
    { _id: req.resources._id },
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

exports.countShareResource = (req, res) => {
  Resource.findById({ _id: req.resources._id }).exec((err, resource) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    }

    resource.shareCount++;
    resource.save();
    res.json(resource);
  });
};

exports.getAllResourceByUser = (req, res) => {
  Resource.find({ user: req.profile._id })
    .populate("user upvotes.user comments.user")
    .sort({ createdAt: -1 })
    .exec((err, resources) => {
      if (err) {
        return res
          .json(400)
          .json({ errorMsg: "An error occured, try again later" });
      }
      res.status(200).json(resources);
    });
};
