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
const { createIdea, getIdea, allIdeas, updateIdea, deleteIdea } = require("../controllers/idea.controller")
const router = express.Router()

// param
router.param("userId", getUserById)
router.param("ideaId", getBlogById)

// create idea
router.post(
  "/create/idea/:userId",
  isSignedIn,
  isAuthenticated,
  upload.single("picture"),
  createIdea
)

//get a particular blog
router.get("/idea/:ideaId", isSignedIn, getIdea)

// all blogs
router.get("/ideas", isSignedIn, allIdeas)

// update blog
router.put(
  "/update/idea/:userId/:ideaId",
  isSignedIn,
  isAuthenticated,
  upload.single("picture"),
  updateIdea
)

// delete blog
router.delete(
  "/delete/idea/:userId/:ideaId",
  isSignedIn,
  isAuthenticated,
  deleteIdea
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
