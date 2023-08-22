import React, { useEffect, useState } from 'react'
import { Alert, Breadcrumb, Image, Spinner } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import dateFormat from 'dateformat'
import { useSelector } from 'react-redux'
import { marked } from "marked";
import {
    EmailShareButton,
    FacebookShareButton,
    WhatsappShareButton,
    InstapaperShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    FacebookIcon,
    WhatsappIcon,
    TwitterIcon,
    LinkedinIcon,
    FacebookMessengerIcon,
} from "react-share";

import './blogDescription.css'
const apiUrl = import.meta.env.VITE_API_URI;

const BlogDescriptionPage = () => {

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
    axios.defaults.withCredentials = true;

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

    const shareUrl = "https://tech-stuffs.netlify.app/"


    return (
        <div className='post-description-page'>
            <div className='posts-page d-flex justify-content-evenly mt-4 container-fluid'>
                {/* {console.log(postDetails.body_html && postDetails.body_html.replace("DEV", "OUR"))} */}
                <div className="sidebar">
                    {
                        postDetails && (
                            <>
                                <div className="icon d-flex flex-column align-items-center py-2">
                                    {postDetails.likedBy && !postDetails.likedBy.includes(userInfo._id) ? (
                                        <span className="cursor-pointer hover:text-[#ff6154]">
                                            <i onClick={handleLike} className="ri-heart-add-line"></i>
                                        </span>
                                    ) : (
                                        <span className="cursor-pointer hover:text-[#ff6154]">
                                            <i onClick={handleLike} className="ri-heart-add-fill"></i>
                                        </span>
                                    )
                                    }
                                    {/* {console.log(userInfo)} */}
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
                <div className="container-fluid">
                    {
                        postDetails && (
                            <>
                                <div className="banner container">
                                    <Image className='banner-image' fluid src={postDetails.images && postDetails.images[0].path} alt="" />
                                </div>
                                <div className="post-content my-5 container">
                                    <div className="post-tags my-3">
                                        {
                                            postDetails.tags && postDetails.tags[0].split(",").map((tag, idx) => (
                                                <Link to={`/blogs/${tag.trim()}`} key={idx} className='tags'># {tag}</Link>
                                            ))
                                        }
                                        {/* <button class="btn">
                                            <span>Share</span><span>
                                                <svg height="18" width="18" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" class="icon">
                                                    <path fill="#ffffff" d="M767.99994 585.142857q75.995429 0 129.462857 53.394286t53.394286 129.462857-53.394286 129.462857-129.462857 53.394286-129.462857-53.394286-53.394286-129.462857q0-6.875429 1.170286-19.456l-205.677714-102.838857q-52.589714 49.152-124.562286 49.152-75.995429 0-129.462857-53.394286t-53.394286-129.462857 53.394286-129.462857 129.462857-53.394286q71.972571 0 124.562286 49.152l205.677714-102.838857q-1.170286-12.580571-1.170286-19.456 0-75.995429 53.394286-129.462857t129.462857-53.394286 129.462857 53.394286 53.394286 129.462857-53.394286 129.462857-129.462857 53.394286q-71.972571 0-124.562286-49.152l-205.677714 102.838857q1.170286 12.580571 1.170286 19.456t-1.170286 19.456l205.677714 102.838857q52.589714-49.152 124.562286-49.152z">
                                                    </path>
                                                </svg>
                                            </span>
                                            <ul>
                                                <li>
                                                    <a href="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                                            <path fill="#ffffff" d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                                                        </svg>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href=""><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                                                        <path fill="#ffffff" d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
                                                    </svg></a>

                                                </li>
                                                <li>
                                                    <a href=""><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                                                        <path fill="#ffffff" d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                                                    </svg>
                                                    </a>
                                                </li>
                                            </ul>
                                        </button> */}
                                    </div>
                                    <h1 className='my-4'>{postDetails.title}</h1>
                                    <div className='blog-post-description' dangerouslySetInnerHTML={{ __html: postDetails.body_html && marked.parse(postDetails.body_html.replace(/DEV/g, "OUR")) }} />
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



            <div className="container-fluid reviews">
                {
                    postDetails && (
                        <>
                            <div className="reviews-container mb-5 d-flex jusitfy-content-center flex-col p-8 rounded-2xl bg-white">
                                {postDetails.reviews && postDetails.reviews.map((review, idx) => (
                                    <>
                                        <div key={idx} className="flex mt-5">
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
        </div>
    )
}

export default BlogDescriptionPage
