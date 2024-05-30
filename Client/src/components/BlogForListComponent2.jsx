import React from 'react'
import { Link } from 'react-router-dom'

const BlogForListComponent2 = ({ post }) => {
    // Define default values
    const defaultTitle = 'Blog website';
    const defaultDescription = 'Description for the blog post.';

    return (
        <div className='blog-list-2' style={{ width: '100%' }}>
            <div className="mx-3 mt-4 p-3">
                <div style={{ color: '#0066FF' }} className='pb-2 card-subheading '>
                    <Link to="/">
                        Blog Article
                    </Link>
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
                <div className="card-tags mt-3">
                    {post?.tags && post.tags.length > 0 ? (
                        post.tags.map((tag, index) => (
                            <span key={index} className='tag-badge' style={tagStyle}>
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className='tag-badge' style={tagStyle}>
                            Default Tag
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// Inline styles for tags
const tagStyle = {
    display: 'inline-block',
    backgroundColor: '#f1f1f1',
    color: '#333',
    borderRadius: '5px',
    padding: '5px 10px',
    margin: '5px',
    fontSize: '0.85rem'
}

export default BlogForListComponent2
