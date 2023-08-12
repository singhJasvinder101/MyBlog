const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Review = require('./reviewModel');

const imageSchema = ({
    path: { type: String, required: true }
})

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    images: [imageSchema],
    body_html: {
        type: String,
        required: true,
    },
    postLikes: {
        type: Number,
        default: 0, // default value 0 to avoid errors while increment or decrement
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],
    tags: {
        type: [String], // Tags represented as an array of strings
        required: true,
    },
    reviewsNumber: {
        type: Number,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: Review
    }],
    author: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

// blogSchema.index({ tags: 'text', title: 'text', description: 'text' }, { name: 'tagsIndex' });
blogSchema.index({ title: 'text', description: 'text', category: 'text' }, { name: 'textIndex' });


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;


