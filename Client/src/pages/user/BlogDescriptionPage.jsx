import React, { useEffect, useState } from 'react'
import { Alert, Breadcrumb, Image, Spinner } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import dateFormat from 'dateformat'
import { useSelector } from 'react-redux'
import PaginationComponent from '../../components/PaginationComponent'
const check_token = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/api/get-token`, {
            withCredentials: true,
        })
        if (data.token) {
            console.log(data.token)
        }
    } catch (error) {
        console.log(error);
    }
}
check_token()

const BlogDescriptionPage = () => {
    const apiUrl = import.meta.env.VITE_API_URI;

    const userInfo = useSelector(state => state.userLoggedIn.userInfo)
    const { postId } = useParams()
    const [postDetails, setPostDetails] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [isComment, setIsComment] = useState(false)
    const [isCommentLiked, setIsCommentLiked] = useState(false)
    const [commentResponseState, setCommentResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    })

    const fetchPostDetails = async (postId) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/blogs/get-one/${postId}`, {
                withCredentials: true,
            });
            return data;
        } catch (error) {
            console.log("Error fetching post details:", error);
            return null;
        }
    }

    useEffect(() => {
        fetchPostDetails(postId).then(data => {
            setPostDetails(data)
        }).catch(err => {
            console.log(err)
        })
    }, [postId, isLiked, isComment, isCommentLiked])

    // console.log(postDetails)
    // console.log(isLiked)

    const handleLike = async () => {
        const { data } = await axios.post(`${apiUrl}/api/users/like/${postId}`, {}, {
            withCredentials: true,
        })
        if (data.success) {
            setIsLiked(prevIsLiked => !prevIsLiked);
        }
    }

    const handleCommentLike = async (commentId) => {
        const { data } = await axios.post(`${apiUrl}/api/users/commentlike/${commentId}`, {}, {
            withCredentials: true,
        })
        if (data.success) {
            setIsCommentLiked(!isCommentLiked)
        }
    }

    const handleSubmit = async (e) => {
        setCommentResponseState({ loading: true })

        e.preventDefault();
        const form = e.currentTarget.elements
        const comment = form.comment.value
        // console.log(form)

        try {
            const { data } = await axios.post(`${apiUrl}/api/users/comment/${postId}`, 
            { comment }, {
                withCredentials: true,
            })
            setCommentResponseState({
                success: data.success,
                loading: false,
            })
            if (data.success) {
                // console.log("comment added")
                setIsComment(!isComment)
            }
        } catch (err) {
            setCommentResponseState({
                error: err.response.data ? err.response.data : err.response
            })
            // console.error("Error adding comment:", err.response.data);
        }
    }

    const handleCopyUrl = () => {
        const currentUrl = window.location.href;
    
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                alert('URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying URL to clipboard:', err);
                alert('Failed to copy URL to clipboard. Please try again.');
            });
    };
    const handleGoToComments = () => {
        const commentsSection = document.getElementById("comment");
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: "smooth" });
        }
    };
    

    return (
        <>
            <div className='posts-page d-flex justify-content-evenly mt-4 container-fluid'>
                {/* {console.log(postDetails.body_html && postDetails.body_html.replace("DEV", "OUR"))} */}
                <div className="sidebar">
                    {
                        postDetails && (
                            <>
                                <div className="icon d-flex flex-column align-items-center py-2">
                                    <i onClick={handleLike} className="ri-heart-add-line"></i>
                                    {postDetails.postLikes}
                                </div>
                                <div className="icon d-flex flex-column align-items-center py-2">
                                    <i onClick={handleGoToComments} className="ri-chat-3-line"></i>
                                    {postDetails.reviews && postDetails.reviews.length}
                                </div>
                                <div className="icon py-2">
                                    <i onClick={handleCopyUrl} className="ri-file-copy-fill"></i>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="container">
                    {
                        postDetails && (
                            <>
                                <div className="banner">
                                    <Image fluid src={postDetails.images && postDetails.images[0].path} alt="" />
                                </div>
                                <div className="post-content my-5 container">
                                    <div className="post-tags my-5">
                                        {
                                            postDetails.tags && postDetails.tags[0].split(",").map((tag, idx) => (
                                                <Link to={`/blogs/${tag.trim()}`} key={idx} className='tags'># {tag}</Link>
                                            ))
                                        }
                                    </div>
                                    <h1 className='my-4'>{postDetails.title}</h1>
                                    <div className='blog-post-description' dangerouslySetInnerHTML={{ __html: postDetails.body_html && postDetails.body_html.replace(/DEV/g, "OUR") }} />
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
            <div className="comment my-3">
                <div className="comment-card m-auto">
                    <span className="title">Leave a Comment</span>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="group">
                            <textarea name='comment' placeholder="‎" id="comment" rows="5" required="" />
                            <label htmlFor="comment">Comment</label>
                        </div>
                        <button type="submit">
                        {commentResponseState && commentResponseState.loading === true ? (
                                    <Spinner
                                        className='mx-2'
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true" />
                                ) : ""}
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            {/* {console.log(userInfo.Object.keys().length === 0)} */}
            {Object.keys(userInfo).length === 0 && (
                <Alert className='mt-3 container' variant="danger">
                    Please register or login yourself for adding a comment.
                </Alert>
            )}

            {
                commentResponseState ? (
                    <Alert className='mt-3 container' show={commentResponseState.error === "already reviewed"} variant="danger">
                        You have already reviewed on this post
                    </Alert>
                ) : (
                    <Alert className='mt-3 container' show={commentResponseState.error === "All inputs are required"} variant="danger">
                        Please write the comment of at least 2-3 characters
                    </Alert>
                )
            }



            <div className="container reviews">
                {
                    postDetails && (
                        <>
                            <div className="mb-5 d-flex jusitfy-content-center flex-col p-8 rounded-2xl bg-white">
                                {postDetails.reviews && postDetails.reviews.map((review, idx) => (
                                    <>
                                        <div className="flex mt-5">
                                            <div className="flex gap-4">
                                                <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" alt="" className="w-12 h-12 cursor-pointer mr-2" />
                                                <div className="comment-bar d-flex flex-column gap-1 justify-content-center">
                                                    <div className="d-flex align-items-center  gap-3 items-center -mt-1">
                                                        {/* {console.log(postDetails.reviews)} */}
                                                        <div className="font-semibold cursor-pointer mr-3 ">{review.user.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="italic mt-3 text-[18px] text-[#4b587c] font-normal">
                                            <div key={idx} className="review">
                                                {review.comment}
                                            </div>
                                        </div>
                                        <div className="d-flex mt-3 comment-bottom gap-6 text-[#4b587c] text-[12px]">
                                            <span
                                                className="cursor-pointer mr-4">
                                                {dateFormat(review.createdAt)}
                                            </span>
                                            {/* {console.log(review.likedBy)} */}
                                            {/* {console.log(review._id)} */}
                        
                                            {!review.likedBy.includes(userInfo._id) ? (
                                                <span className="cursor-pointer hover:text-[#ff6154]">
                                                    <i onClick={() => handleCommentLike(review._id)} className="ri-heart-line"></i>
                                                </span>
                                            ) : (
                                                <span className="cursor-pointer hover:text-[#ff6154]">
                                                    <i onClick={() => handleCommentLike(review._id)} className="ri-heart-fill"></i>
                                                </span>
                                            )
                                            }
                                            <span className='mx-2'>{review.commentLikes}</span>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default BlogDescriptionPage
