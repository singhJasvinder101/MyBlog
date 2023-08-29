const express = require('express');
const { 
    registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, likePost, likeComment, deletingComment
} = require('../controllers/userController');
const { verifyIsLoggedIn } = require('../middlewares/verifyAuthToken');
const { followUser, getfollowers } = require('../controllers/blogPostController');
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)

router.use(verifyIsLoggedIn)
router.patch("/profile", updateUserProfile)
router.get("/profile/:id", getUserProfile)
router.post("/like/:postId", likePost)
router.post("/comment/:postId", writeReview)
router.post("/commentlike/:reviewId", likeComment)
router.delete("/comment/:reviewId", deletingComment)


// to do:  changing username to id if users increased
router.get("/follow/:username", followUser)
router.get("/blog/owner/:username", getfollowers)

module.exports = router;