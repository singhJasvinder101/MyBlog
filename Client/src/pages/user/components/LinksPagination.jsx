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


// import './blogDescription.css'
const apiUrl = import.meta.env.VITE_API_URI;
const LinksPagination = ({ postId }) => {

    const userInfo = useSelector(state => state.userLoggedIn.userInfo)
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
            console.log(data)
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
        <div className='like-share-footer bg-white text-dark'>
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
        </div>
    )
}

export default LinksPagination
