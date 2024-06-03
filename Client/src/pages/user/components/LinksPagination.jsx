import React, { useEffect, useState } from 'react'
import { Alert, Breadcrumb, Image, Spinner } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
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
import TextToSpeech from './TextToSpeech'
import { IoShareSocialOutline } from "react-icons/io5";


const apiUrl = import.meta.env.VITE_API_URI;
const LinksPagination = ({ postId }) => {
    const location = useLocation();

    const userInfo = useSelector(state => state.userLoggedIn.userInfo)
    const [postDetails, setPostDetails] = useState([])
    const [isLiked, setIsLiked] = useState(false)

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isSharingSupported, setIsSharingSupported] = useState(
        Boolean(navigator.share)
    );
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
    }, [postId, isLiked])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLike = async () => {
        const { data } = await axios.post(`${apiUrl}/api/users/like/${postId}`, {}, {
            withCredentials: true,
        })
        if (data.success) {
            setIsLiked(prevIsLiked => !prevIsLiked);
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
    const handleShare = async () => {
        try {
            await navigator.share({
                title: "Tech Blog",
                text: "Hey! Let's join the blog to explore the tech world",
                url: shareUrl, 
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };


    return (
        <>
            <div className={`like-share-footer text-dark`}>
                <div className="bottom-sidebar">
                    {
                        postDetails && (
                            <>
                                {
                                    windowWidth <= 1068 && (
                                        <>

                                            <div className="icon d-flex align-items-center py-2">
                                                {postDetails.likedBy && !postDetails.likedBy.includes(userInfo._id) ? (
                                                    <span className="cursor-pointer mx-2 hover:text-[#ff6154]">
                                                        <i onClick={handleLike} className="ri-heart-add-line"></i>
                                                    </span>
                                                ) : (
                                                    <span className="cursor-pointer mx-2 hover:text-[#ff6154]">
                                                        <i onClick={handleLike} className="ri-heart-add-fill"></i>
                                                    </span>
                                                )
                                                }
                                                {/* {console.log(userInfo)} */}
                                                {postDetails.postLikes}
                                            </div>
                                            <div className="icon d-flex mx-2 align-items-center py-2">
                                                <i onClick={handleGoToComments} className="ri-chat-3-line mx-2"></i>
                                                {postDetails.reviews && postDetails.reviews.length}
                                            </div>
                                            <div className="icon d-flex py-2">
                                                {/* <i onClick={handleCopyUrl} className="ri-file-copy-fill"></i> */}
                                                {isSharingSupported && (
                                                    <div className="icon d-flex mx-2 align-items-center py-2">
                                                        <button onClick={handleShare} className="bottom-sidebar-share">
                                                            <IoShareSocialOutline fontSize={'1.3rem'} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="icon p-1 d-flex align-items-center">
                                                {/* {console.log(postDetails.body_html)} */}
                                                {postDetails  && <TextToSpeech text={postDetails.body_html} />}
                                            </div>
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default LinksPagination
