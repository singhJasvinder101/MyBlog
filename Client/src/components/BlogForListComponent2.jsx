import React from 'react';
import { Link } from 'react-router-dom';

const BlogForListComponent2 = ({ post }) => {
    // Define default values
    const defaultTitle = 'Blog website';
    const defaultDescription = 'Description for the blog post.';

    // Custom styles for tags
    const tagColors = ['#FF5733', '#33FF57', '#5733FF']; // Example colors for tags
    const getRandomColor = () => tagColors[Math.floor(Math.random() * tagColors.length)];
    const tagStyle = {
        display: 'inline-block',
        backgroundColor: getRandomColor(),
        color: '#333',
        borderRadius: '20px',
        padding: '5px 10px',
        margin: '0 5px 5px 0', // Adjusted margin for spacing
        fontSize: '0.85rem',
        whiteSpace: 'nowrap' // Prevent tags from wrapping onto a new line
    };

    return (
        <div className='blog-list-2' style={{ width: '100%' }}>
            <div className="mx-3 mt-4 p-3">
                <div style={{ color: '#0066FF' }} className='pb-2 card-subheading '>
                    <Link to="/">
                        My Article
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
                            <span key={index} className='tag-badge' style={{ ...tagStyle, backgroundColor: getRandomColor() }}>
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
    );
};

export default BlogForListComponent2;
