const connectDB = require("../config/db");
const fetchData = require("./BlogPosts");
const Blog = require("../models/blogModel");
require('dotenv').config()
connectDB();

// console.log(process.env.MONGO_URI)

const importData = async () => {

    try {
        // await Blog.collection.deleteMany({})
        const blogposts = await fetchData();
        await Blog.insertMany(blogposts);
        console.log('Data seeding completed.'); 
    } catch (error) {
        console.error('Error while seeding:', error);
        process.exit(1);
    }
};

importData();
