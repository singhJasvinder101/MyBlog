import React from 'react';
import { Link } from 'react-router-dom';

const BlogForListComponent2 = ({ post }) => {
    return (
        <div class="blog-list-2" style={{ width: '50%' }}>
            <div class="list-card">
                <div class="list-img-container">
                    {post?.cover_image}
                </div>
                <div class="list-card-content">
                    <Link to={`/post-details/${post?._id}`}>{post?.user?.name || 'Unknown User'}</Link>
                    <Link className='text-light' to={`/post-details/${post?._id}`}>
                        {post?.title}
                    </Link>
                    <div className='card-description' style={{ fontSize: '0.95rem' }}>
                        {post?.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogForListComponent2;
