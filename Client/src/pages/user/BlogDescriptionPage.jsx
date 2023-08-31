import React, { useEffect, useState } from 'react'
import { Alert, Breadcrumb, Carousel, Image, Spinner } from 'react-bootstrap'
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
import LinksPagination from './components/LinksPagination'
import BlogForListComponent2 from '../../components/BlogForListComponent2'
import BlogForListPageComponent from '../../components/BlogForListPageComponent'
import Sidebar from './components/PopularArticles'
import LoaderComponent from '../components/LoaderComponent'


// import './blogDescription.css'
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
    const [isLoading, setIsLoading] = useState(true)
    const [isLoading2, setIsLoading2] = useState(true)

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
            setTimeout(() => {
                setPostDetails(data)
                setIsLoading(false)
            }, 100);
        }).catch(err => {
            console.log(err)
        })
    }, [postId, isLiked, isComment, isCommentLiked])

    console.log(postDetails.tags)
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
    const [posts, setPosts] = useState([])

    const apiUrl = import.meta.env.VITE_API_URI;

    const fetchArticles = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/blogs`)
            return data
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchArticles().then(data => setPosts(data.posts))
            .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readingTimeInMinutes = Math.ceil(wordCount / wordsPerMinute);
        return readingTimeInMinutes;
    }

    const userId = useSelector(state => state.userLoggedIn.userInfo._id)

    const [followUserResponseState, setFollowUserResponseState] = useState({
        error: "",
        loading: false,
    })
    const [isFollowed, setIsFollowed] = useState(false)
    const [postOwnerDetails, setPostOwnerDetails] = useState([])

    const author = postDetails.author
    const fetchOwnerDetails = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/users/blog/owner/${author}`, {
                withCredentials: true,
            });
            return data;
        } catch (error) {
            console.log("Error fetching post details:", error);
            return null;
        }
    }
    // console.log(userDetails.author)

    useEffect(() => {
        fetchOwnerDetails().then(data => {
            setTimeout(() => {
                setPostOwnerDetails(data.user)
                // console.log(data)
            }, 100);
        }).catch(err => {
            console.log(err)
        })
    }, [isFollowed, postId, author]);

    // console.log(postOwnerDetails)
    // console.log(currentFollowers)

    const handleFollowUser = async (username) => {
        setFollowUserResponseState({ loading: true })
        try {
            const { data } = await axios.get(`${apiUrl}/api/users/follow/${decodeURI(username)}`, {
                withCredentials: true,
            })
            if (data.success) {
                setFollowUserResponseState({
                    loading: false,
                })
                setIsFollowed(prevIsFollowed => !prevIsFollowed);
            }
        } catch (error) {
            // console.log(error)
            setFollowUserResponseState({
                loading: true,
                error: error.response.data.message ? error.response.data.message : error.response.data,
                followed: false
            })
        }
    }


    useEffect(() => {
        Prism.highlightAll();
    }, [postDetails.body_html]);


    return (
        <>
            {isLoading ? (
                <LoaderComponent />
            ) : (
                <div className='post-description-page'>
                    <div className='posts-page d-flex justify-content-evenly mt-4 description-container'>
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
                                            )}

                                            {/* {console.log(postDetails.likedBy)}
                                            {console.log(userInfo._id)} */}
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
                        <div className="">
                            {
                                postDetails && (
                                    <>
                                        <div className="posts-description-container d-flex justify-content-between">
                                            <div className="post-content content-container">
                                                <div className="banner banner-container container">
                                                    <Image className='banner-image' fluid src={postDetails.images && postDetails.images[0].path} alt="" />
                                                </div>
                                                <div className="post-tags my-3">
                                                    {/* {console.log(postDetails.tags)} */}
                                                    {
                                                        postDetails.tags && postDetails.tags.length === 1 ? (postDetails.tags[0].split(",").map((tag, idx) => (
                                                            <Link to={`/blogs/${tag.trim()}`} key={idx} className='tags'># {tag}</Link>
                                                        ))) : (
                                                            postDetails.tags.map((tag, idx) => (
                                                            <Link to={`/blogs/${tag.trim()}`} key={idx} className='tags'># {tag}</Link>
                                                        )))
                                                    }
                                                </div>
                                                <div className="author-details d-flex align-items-center my-3">
                                                    <div className='ml-3 author'>
                                                        <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" alt="" className="w-12 h-12 cursor-pointer mr-2 rounded-circle" />
                                                    </div>
                                                    <div className="read-mins post-date d-flex flex-column justify-content-center">
                                                        <div className=''>
                                                            <p className='d-inline ml-1'>{postDetails.author}</p>
                                                            {followUserResponseState.loading ? (
                                                                <button style={{ margin: 0, height: '18px', padding: 0 }} className="card__btn card__btn-solid m-0">
                                                                    {/* {console.log(postOwnerDetails.followedBy && postOwnerDetails.followedBy.includes(userId))} */}
                                                                    <Spinner
                                                                        style={{ margin: 0 }}
                                                                        className='mx-2 py-0 m-0'
                                                                        as="span"
                                                                        animation="border"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true" />
                                                                </button>
                                                            ) : postOwnerDetails?.followedBy?.includes(userId) ? (
                                                                <button onClick={() => handleFollowUser(postDetails.author)} className='follow px-3 mx-0'> FOLLOWING</button>
                                                            ) : (
                                                                <button onClick={() => handleFollowUser(postDetails.author)} className='follow px-3 mx-0'> FOLLOW</button>
                                                            )}
                                                        </div>
                                                        <span className='d-flex flex-wrap mx-0 read-mins'>
                                                            <span className='px-2'>{postDetails.body_html && calculateReadingTime(postDetails.body_html)} mins read</span>
                                                            <span className='px-2'>{dateFormat(postDetails.createdAt, "fullDate")}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <h1 className='my-4'>{postDetails.title}</h1>
                                                <div className='blog-post-description' dangerouslySetInnerHTML={{ __html: postDetails.body_html && postDetails.body_html.replace(/DEV/g, "OUR") }} />
                                            </div>
                                            <div className="right-sidebar">
                                                <Sidebar
                                                    popularArticles={posts
                                                        .filter(post => {
                                                            const excludedIds = ["64d361430b96fbb0ea77c3d6", "64d361430b96fbb0ea77c3dc", "64d361430b96fbb0ea77c3e8", "64d361430b96fbb0ea77c40e", "64d361430b96fbb0ea77c3ec", postId];
                                                            return !excludedIds.includes(post._id.toString());
                                                        })}
                                                    postId={postId}
                                                    userDetails={postDetails}
                                                />
                                            </div>
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
                                                <div key={idx + 10} className="flex mt-5">
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
                                                <div className="d-flex mt-3 comment-bottom justify-content text-[#4b587c] text-[12px]">
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
                    <LinksPagination postId={postId} />
                </div>
            )}
        </>
    )
}

export default BlogDescriptionPage
