const User = require('../models/userModel')
const { hashingPassword, comparePassword } = require('../utils/HashingPassword')
const { generatingAuthToken } = require('../utils/generatingAuthToken')
const Review = require('../models/reviewModel')
const Blog = require('../models/blogModel')

const registerUser = async (req, res, next) => {
    try {
        const { name, lastname, email, password } = req.body
        if (!name && !lastname && !email && !password) {
            return res.status(400).send("All inputs are required")
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("user already exists")
        } else {
            const hashedPassword = hashingPassword(req.body.password)
            const newUser = await User.create({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email.toLowerCase(),
                password: hashedPassword,
                isAdmin: req.body.isAdmin
            })
            return res.cookie("auth_token", generatingAuthToken(
                newUser._id, newUser.name, newUser.lastname, newUser.email, newUser.password, newUser.isAdmin
            ), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
            })
                .status(201).json({
                    success: "user created",
                    userCreated: {
                        name: newUser.name,
                        lastname: newUser.lastname,
                        email: newUser.email,
                        password: newUser.password,
                        isAdmin: newUser.isAdmin
                    }
                })
        }
    } catch (error) {
        next(error)
    }
}

// now login also done just authentication and authorization of private pages left middleware used

const loginUser = async (req, res, next) => {
    try {
        const { email, password, donotlogout } = req.body
        if (!(email && password)) {
            return res.status(400).send("All input fields are required")
        }
        const userExists = await User.findOne({ email }).orFail();
        if (userExists && comparePassword(password, userExists.password)) {
            const cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
            }
            if (donotlogout) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }
            }
            // console.log("hello")
            return res.cookie('auth_token', generatingAuthToken(
                userExists._id, userExists.name, userExists.lastname, userExists.email, userExists.password, userExists.isAdmin
            ), cookieParams)
                .json({
                    success: true,
                    userLoggedIn: {
                        _id: userExists._id,
                        name: userExists.name,
                        lastname: userExists.lastname,
                        email: userExists.email,
                        isAdmin: userExists.isAdmin,
                        donotlogout,
                    }
                })
        } else {
            return res.status(401).send("wrong credentials")
        }
    } catch (error) {
        next(error)
    }
}

const updateUserProfile = async (req, res, next) => {
    try {
        const user = User.findOneAndUpdate(req.user._id).orFail()
        user.name = req.body.name || user.name;
        user.lastname = req.body.lastname || user.lastname;
        user.phoneNumber = req.body.phoneNumber;
        user.profession = req.body.profession
        user.experience = req.body.experiance
        if (req.body.password !== user.password) {
            user.password = hashingPassword(req.body.password);
        }
        await user.save();
        res.json({
            success: "user updated",
            userUpdated: {
                _id: user._id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        next(error)
    }
}

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail()
        res.send(user)
    } catch (error) {
        next(error)
    }
}
const writeReview = async (req, res, next) => {
    try {
        const { comment } = req.body
        // validate request
        if (!(comment)) {
            return res.status(400).send("All inputs are required")
        }
        // creating review id for saving blogs posts collection
        const ObjectId = require("mongodb").ObjectId;
        let reviewId = new ObjectId();

        // for creating review document
        await Review.create([
            {
                _id: reviewId,
                comment,
                user: {
                    _id: req.user._id,
                    name: req.user.name + " " + req.user.lastname
                }
            }
        ])
        const blogPost = await Blog.findById(req.params.postId).populate("reviews")
        const alreadyReviewed = blogPost.reviews.find(x => x.user._id.toString() === req.user._id)
        if (alreadyReviewed) {
            return res.status(400).send("already reviewed")
        }

        // for just saving the reviewId in post
        blogPost.reviews.push(reviewId)
        blogPost.reviewsNumber = blogPost.reviews.length

        await blogPost.save()
        res.json({
            success: true,
            message: "review created"
        })
        // res.send(blogPost)

    } catch (error) {
        next(error)
    }
}

const likePost = async (req, res, next) => {
    try {
        // const blogPost = await Blog.findById(req.params.postId).populate("reviews");
        const blogPost = await Blog.findById(req.params.postId);
        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }

        const alreadyLikedPost = blogPost.likedBy.includes(req.user._id);

        if (alreadyLikedPost) {
            blogPost.postLikes--;
            blogPost.likedBy = blogPost.likedBy.filter(x => x.toString() !== req.user._id.toString());
        } else {
            blogPost.postLikes++;
            blogPost.likedBy.push(req.user._id);
        }

        await blogPost.save();
        res.json({
            success: true,
            message: "Post liked"
        });
    } catch (error) {
        next(error);
    }
};


// i need to modify the review model bcoz i need to track if the user already liked 
// comment or not 
const likeComment = async (req, res, next) => {
    try {
        if (!req.user._id) {
            return res.status(400).send("login required");
        }

        const comment = await Review.findById(req.params.reviewId);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        const alreadyLikedComment = comment.likedBy.includes(req.user._id)

        if (alreadyLikedComment) {
            comment.commentLikes--;
            comment.likedBy = comment.likedBy.filter(x => x.toString() !== req.user._id.toString());
        } else {
            comment.commentLikes++;
            comment.likedBy.push(req.user._id);
        }

        await comment.save();
        res.json({
            success: true,
            message: "comment liked"
        });
    } catch (error) {
        next(error);
    }
};

const deletingComment = async (req, res, next) => {
    try {
        const comment = await Review.findById(req.params.reviewId)
        // console.log(comment)
        if (!comment) return res.status(400).send("comment not found");

        await comment.deleteOne()
        res.json({
            success: true,
            message: "comment Deleted"
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    getUserProfile,
    writeReview,
    likePost,
    likeComment,
    deletingComment
}