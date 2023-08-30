const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const imageValidate = require("../utils/imageValidate")
const axios = require('axios');
const adminCreatePost = async (req, res, next) => {
    try {
        const post = new Blog()
        const { title, description, body_html, tags, author, images } = req.body
        post.title = title;
        post.description = description;
        post.body_html = body_html;
        post.tags = tags;
        post.images = images;
        post.author = author;

        await post.save();

        res.json({
            message: "post created",
            postId: post._id,
        });

    } catch (error) {
        next(error)
    }
}

const userCreatePost = async (req, res, next) => {
    try {
        const post = new Blog()
        const { title, description, body_html, tags, author, images } = req.body
        post.title = title;
        post.description = description;
        post.body_html = body_html;
        post.tags = tags;
        post.images = images;
        post.author = author;

        await post.save();

        res.json({
            message: "post created",
            postId: post._id,
        });

    } catch (error) {
        next(error)
    }
}

const getPostByID = async (req, res, next) => {
    try {
        const Post = await Blog.findById(req.params.id)
            .populate("reviews")
            .orFail();
        res.json(Post);
    } catch (err) {
        next(err);
    }
};
const getAllBlogPosts = async (req, res, next) => {
    try {
        const pageNum = Number(req.query.pageNum) || 1;

        // Extract search terms from query parameter
        const searchQuery = req.query.q || ''; // Assuming search terms are passed as 'q' parameter
        const searchTerms = searchQuery.split(',').map(term => term.trim());
        const query = {};


        if (searchTerms.length === 1) {
            // If only one search term is provided, searching in both post content and tags
            const searchTerm = searchTerms[0];
            query.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
                { body_html: { $regex: searchTerm, $options: "i" } },
                { tags: { $in: [searchTerm] } }
            ];

        } else if (searchTerms.length > 1) {
            // If multiple search terms are provided, searching only in tags
            query.tags = { $in: searchTerms };
            // console.log(query)
        }


        const recordsPerPage = 30; // number of records should be per page
        const totalPosts = await Blog.countDocuments(query);
        // console.log(query)
        const posts = await Blog.find(query)
            .limit(recordsPerPage)
            .skip((pageNum - 1) * recordsPerPage)
            .populate("reviews");

        res.json({
            posts,
            pageNum,
            paginationLinksNumber: Math.ceil(totalPosts / recordsPerPage),
        });
    } catch (error) {
        next(error);
    }
};

const adminDeletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId
        await Blog.findByIdAndDelete(postId)
        res.json({
            success: true,
            message: "post Deleted"
        })
    } catch (error) {
        next(error);
    }
}

const adminUpdatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId
        const post = await Blog.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        post.title = req.body.title || post.title;
        post.description = req.body.description || post.description;
        post.body_html = req.body.body_html || post.body_html;
        post.tags = req.body.tags || post.tags;
        post.author = req.body.author || post.author;

        await post.save()
        res.json({
            success: true,
            message: "Post updated"
        });

    } catch (error) {
        next(error);
    }
}

const adminUpload = async (req, res, next) => {
    // to do: will use cloudinary later during frontend (admin) bcoz it will fetch then the url
    // obtain will sent with post request for adminUpload

    // for production upload
    // if (req.query.cloudinary === "true") {
    //     try {
    //         // let post = await Blog.findById(req.query.postId).orFail();
    //         let images = req.files.images
    //         const formData = new FormData()

    //         for (let i = 0; i < images.length; i++) {
    //             const image = images[i];
    //             formData.append('file', image.buffer);
    //             formData.append('upload_preset', 'hndevrtd');

    //             try {
    //                 const response = await axios.post('https://api.cloudinary.com/v1_1/dfdmyewjs/image/upload', 
    //                     formData);
    //                 console.log(response.data.url);
    //                 return res.send("post image added successfully.");
    //             } catch (error) {
    //                 console.log('Cloudinary upload error:', error.message);
    //                 return res.status(500).send('Server error during cloudinary upload.');
    //             }
    //         }
    //         // post.images.push({ path: req.body.url });
    //         // await post.save();
    //     } catch (error) {
    //         return next(error);
    //     }
    // }

    try {
        if (!req.files || !req.files.images) {
            return res.status(400).send("No files uploaded.");
        }

        // for development upload locally
        const validateImages = imageValidate(req.files.images);
        if (validateImages.error) {
            return res.status(400).send(validateImages.error);
        }

        const path = require("path");
        const { v4: uuidv4 } = require('uuid');
        const uploadDirectory = path.resolve(
            __dirname, "../../Client", "public", "images", "posts"
        );

        const post = await Blog.findById(req.query.postId);
        let images = req.files.images;

        if (!Array.isArray(images)) {
            images = [images];
        }
        // console.log(images)

        for (let image of images) {
            const fileName = uuidv4() + path.extname(image.name);
            const uploadPath = uploadDirectory + "/" + fileName;
            post.images.push({ path: "/images/posts/" + fileName });

            try {
                await image.mv(uploadPath);
            } catch (error) {
                console.error(error);
                return res.status(500).send("server error");
            }
        }

        await post.save();
        return res.json({
            success: true,
            message: "Post updated"
        });

    } catch (error) {
        next(error);
    }
}

const followUser = async (req, res, next) => {
    let username = decodeURI(req.params.username).trim()
    // console.log(username)
    try {
        const userExists = await User.findOne({
            $or: [
                { username: username }
            ]
        })
        if (userExists) {
            const alreadyFollowingUser = userExists.followedBy.includes(req.user._id)
            if (alreadyFollowingUser) {
                userExists.followers = userExists.followers > 0 ? userExists.followers - 1 : 0;
                userExists.followedBy = userExists.followedBy.filter(x => x.toString() !== req.user._id.toString());
                // res.status(200).json({ message: 'You are now unfollowing the user.', user: userExists });
                // return res.status(200).json({ message: 'unfollowed', success: true, followers: userExists.followers > 0 ? userExists.followers : 0 });
            } else {
                userExists.followers = userExists.followers + 1;
                userExists.followedBy.push(req.user._id)
            }
            await userExists.save();
            return res.status(200).json({ message: 'followed', success: true, followers: userExists.followers > 0 ? userExists.followers : 0 });
        }
        else {
            const user = req.params.username.split(" ")       // untrim string to save name lastname
            const name = user[0]
            const lastname = user[1] || " "
            const newUser = await User.create({
                name,
                lastname,
                username,
                followers: 0,
                email: username + "@gmail.com",
                password: "1212",
                isAdmin: false,
            });
            await newUser.save()
            return res.status(201).json({ message: 'followed', success: true, followers: newUser.followers });
        }
    } catch (error) {
        next(error)
    }
}

const getfollowers = async (req, res, next) => {
    const username = req.params.username.trim()
    try {
        const user = await User.findOne({ username: username })
        return res.status(200).json({
            user: user
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    adminCreatePost,
    getPostByID,
    getAllBlogPosts,
    adminDeletePost,
    adminUpdatePost,
    adminUpload,
    userCreatePost,
    followUser,
    getfollowers
}
