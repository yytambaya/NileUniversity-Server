const express = require("express")
const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth.controller")
const { getUserById } = require("../controllers/user.controller")
const {
  createBlog,
  allblogs,
  upload,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlog,
  commentBlog,
  upvoteBlog,
  downvoteBlog,
  countShareBlog,
  getAllBlogByUser,
} = require("../controllers/blog.controller")
const { createResource, getResource, allResources, updateResource, deleteResource } = require("../controllers/resource.controller")
const router = express.Router()

// param
router.param("userId", getUserById)
router.param("resourceId", getBlogById)

// create resource
router.post(
  "/create/resource/:userId",
  isSignedIn,
  isAuthenticated,
  upload.single("picture"),
  createResource
)

//get a particular blog
router.get("/resource/:resourceId", isSignedIn, getResource)

// all blogs
router.get("/resources", isSignedIn, allResources)

// update blog
router.put(
  "/update/resource/:userId/:resourceId",
  isSignedIn,
  isAuthenticated,
  upload.single("picture"),
  updateResource
)

// delete blog
router.delete(
  "/delete/resource/:userId/:resourceId",
  isSignedIn,
  isAuthenticated,
  deleteResource
)

// upvote a blog
router.put(
  "/blog/upvote/:userId/:blogId",
  isSignedIn,
  isAuthenticated,
  upvoteBlog
)

// Downvote a blog
router.put(
  "/blog/downvote/:userId/:blogId",
  isSignedIn,
  isAuthenticated,
  downvoteBlog
)

// comment on a blog
router.put(
  "/blog/comment/:userId/:blogId",
  isSignedIn,
  isAuthenticated,
  commentBlog
)

router.get("/share/blog/:blogId", countShareBlog)

router.get("/:userId/blogs", isSignedIn, getAllBlogByUser)

module.exports = router
