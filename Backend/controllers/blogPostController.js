const Blog = require("../models/blogModel");
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
            query.tags = { $in: searchTerms};
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


module.exports = {
    adminCreatePost,
    getPostByID,
    getAllBlogPosts,
    adminDeletePost,
    adminUpdatePost,
    adminUpload,
    userCreatePost
}
