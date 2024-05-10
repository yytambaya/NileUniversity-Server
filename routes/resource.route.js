const express = require("express")
const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth.controller")
const { getUserById } = require("../controllers/user.controller")

const { createResource, getResource, allResources, updateResource, deleteResource, getResourceById, upvoteResource, downvoteResource, commentResource, upload, countShareResource, getAllResourceByUser } = require("../controllers/resource.controller")
const router = express.Router()

// param
router.param("userId", getUserById)
router.param("resourceId", getResourceById)

// create resource
router.post(
  "/create/resource/:userId",
  isSignedIn,
  isAuthenticated,
  upload.single("picture"),
  createResource
)

//get a particular resource
router.get("/resource/:resourceId", isSignedIn, getResource)

// all resources
router.get("/resources", isSignedIn, allResources)

// update resource
router.put(
  "/update/resource/:userId/:resourceId",
  isSignedIn,
  isAuthenticated,
  upload.single("picture"),
  updateResource
)

// delete resource
router.delete(
  "/delete/resource/:userId/:resourceId",
  isSignedIn,
  isAuthenticated,
  deleteResource
)

// upvote a resource
router.put(
  "/resource/upvote/:userId/:resourceId",
  isSignedIn,
  isAuthenticated,
  upvoteResource
)

// Downvote a resource
router.put(
  "/resource/downvote/:userId/:resourceId",
  isSignedIn,
  isAuthenticated,
  downvoteResource
)

// comment on a resource
router.put(
  "/resource/comment/:userId/:resourceId",
  isSignedIn,
  isAuthenticated,
  commentResource
)

router.get("/share/resource/:resourceId", countShareResource)

router.get("/:userId/resources", isSignedIn, getAllResourceByUser)

module.exports = router
