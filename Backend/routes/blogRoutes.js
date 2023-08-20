const express = require("express");
const router = express.Router();
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middlewares/verifyAuthToken");
const {
    adminCreatePost,
    getPostByID,
    getAllBlogPosts,
    adminDeletePost,
    adminUpdatePost,
    adminUpload,
    userCreatePost
} = require("../controllers/blogPostController");

router.get('/', getAllBlogPosts);
router.get('/get-one/:id', getPostByID);

// middleware to get access to resources to admin only
router.use(verifyIsLoggedIn)
router.post("/createPost", userCreatePost)


router.use(verifyIsAdmin)

router.post("/admin", adminCreatePost)
router.delete("/admin/:postId", adminDeletePost)
router.patch("/admin/:postId", adminUpdatePost)
router.post("/admin/upload", adminUpload)

module.exports = router
