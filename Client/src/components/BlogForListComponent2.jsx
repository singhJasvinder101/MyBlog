import React from 'react'
import { Link } from 'react-router-dom'

const BlogForListComponent2 = ({ post }) => {
    // Define default values
    const defaultImage = 'https://via.placeholder.com/150';  // Replace with your default image URL
    const defaultTitle = 'Blog website';
    const defaultDescription = ' description for the blog post.';

    return (
        <div className='blog-list-2' style={{ width: '50%' }}>
            <div className="mx-3 mt-4 p-3">
                <div style={{ color: '#0066FF' }} className='pb-2 card-subheading '>
                    <Link to="/">
                        Blog Article
                    </Link>
                </div>
                <div className="blog-image">
                    <img 
                        src={post.images ? post.images : defaultImage} 
                        alt={post.title || defaultTitle} 
                        style={{ width: '100%', height: 'auto' }} 
                    />
                </div>
                <div className="card-title text-left">
                    <h5>
                        <Link className='text-light' to={`/post-details/${post?._id}`}>
                            {post?.title || defaultTitle}
                        </Link>
                    </h5>
                </div>
                <div className='card-description' style={{ fontSize: '0.95rem' }}>
                    {post?.description || defaultDescription}
                </div>
            </div>
        </div>
    )
}

export default BlogForListComponent2
