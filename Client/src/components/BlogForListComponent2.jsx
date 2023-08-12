import React from 'react'
import { Link, useParams } from 'react-router-dom'
const BlogForListComponent2 = ({ post }) => {
    return (
        <div className='blog-list-2' style={{ width: '50%' }}>
            <div className="mx-3 mt-4 p-3">
                <div style={{ color: '#0066FF' }} className='pb-2 card-subheading '>
                    <Link to="/">
                        Blog Article
                    </Link>
                </div>
                <div className="card-title text-left">
                    {/* {post._id} */}
                    <h5>
                        <Link className='text-light' to={`/post-details/${post?._id}`}>{post?.title}</Link>
                    </h5>
                </div>
                <div className='card-description' style={{ fontSize: '0.95rem' }}>
                    {post?.description}
                </div>
            </div>
        </div>
    )
}

export default BlogForListComponent2
