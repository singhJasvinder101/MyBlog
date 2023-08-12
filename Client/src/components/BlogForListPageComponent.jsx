import React from 'react'
import { Link, useParams } from 'react-router-dom'
import dateFormat from "dateformat";

const BlogForListPageComponent = ({ post }) => {
    const blogId = 12;
    return (
        <>
            <div className="card mx-2 text-light my-3" style={{ height: 'auto' }}>
                <div className='my-2'>
                    <a href="">
                        <img
                            crossOrigin='anonymous'
                            style={{ objectFit: 'cover' }}
                            src={post.images[0].path}
                            className="card-img-top"
                            alt="product-image"
                        />
                    </a>
                    <div className="mx-3 mt-4 p-2">
                        <div style={{ color: '#0066FF' }} className='pb-2 card-subheading '>
                            <Link to="/">
                                Blog Article
                            </Link>
                        </div>
                        <div className="card-title text-left">
                            <h5>
                                <Link className='text-light' to={`/post-details/${post._id}`}>{post.title}</Link>
                            </h5>
                        </div>
                        <div className='card-description' style={{ fontSize: '0.95rem' }}>
                            {post.description}
                        </div>
                        <div className="">
                            <div className="d-flex flex-column justify-content-left my-3">
                                @ {post.author} <i>published At: {dateFormat(post.createdAt, "fullDate")} </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogForListPageComponent
