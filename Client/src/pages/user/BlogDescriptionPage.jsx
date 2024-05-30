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
    TwitterShareButton,
    LinkedinShareButton,
    FacebookIcon,
    WhatsappIcon,
    TwitterIcon,
    LinkedinIcon,
    FacebookMessengerIcon,
} from "react-share";
import LinksPagination from './components/LinksPagination'
import BlogForListPageComponent from '../../components/BlogForListPageComponent'
import LoaderComponent from '../components/LoaderComponent'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tabs } from '@mui/material'
import {
    useQuery,
} from '@tanstack/react-query';
import TextToSpeech from './components/TextToSpeech'
import * as hf from "@huggingface/inference";
import ScrollToTop from '../ScrollToTopButton'; 
 

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
    const [isSummaryLoading, setisSummaryLoading] = useState(true)
    const accessToken = import.meta.env.VITE_HF_ACCESS_TOKEN;
    const [tabValue, setTabValue] = useState("1")
    const [summaryText, setSummaryText] = useState()

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
                setIsComment(!isComment)
            }
        } catch (err) {
            setCommentResponseState({
                error: err.response.data ? err.response.data : err.response
            })
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


    const fetchArticles = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/blogs/?pageNum=2`)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const { data: { posts } = {}, isLoading: postsLoading, error: postsError } = useQuery({
        queryKey: ['posts2'],
        queryFn: fetchArticles,
        staleTime: 1000 * 60 * 60 * 24,
    })

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

    useEffect(() => {
        fetchOwnerDetails().then(data => {
            setTimeout(() => {
                setPostOwnerDetails(data.user)
            }, 100);
        }).catch(err => {
            console.log(err)
        })
    }, [isFollowed, postId, author]);


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




    const summarizeTest = async (text) => {
        setisSummaryLoading(true)
        const summaRes = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: text,
            parameters: {
                max_length: 300
            }
        })
        setSummaryText(summaRes)
        setisSummaryLoading(false)
        return summaRes
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (postsError) {
        return <div className='text-center'>
            <h3>Something went wrong</h3>
        </div>
    }

    return (
        <div className="container">
            {isLoading ? (
                <div className="text-center">
                    <LoaderComponent />
                </div>
            ) : (
                <>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/blogs" }}>Blogs</Breadcrumb.Item>
                        <Breadcrumb.Item active>{postDetails.title}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="blog-description">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1>{postDetails.title}</h1>
                            <div>
                                <FacebookShareButton url={shareUrl}>
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={shareUrl}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <WhatsappShareButton url={shareUrl}>
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                                <LinkedinShareButton url={shareUrl}>
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                                <EmailShareButton url={shareUrl}>
                                    <FacebookMessengerIcon size={32} round />
                                </EmailShareButton>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <Image src={postDetails.author.avatar} roundedCircle width={50} height={50} className="me-3" />
                                <div>
                                    <h5>{postDetails.author.username}</h5>
                                    <p className="mb-0">{dateFormat(postDetails.createdAt, "longDate")}</p>
                                    <p className="mb-0">{calculateReadingTime(postDetails.body_html)} min read</p>
                                </div>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleFollowUser(postDetails.author.username)}
                            >
                                {isFollowed ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                        <Carousel className="mb-3">
                            {postDetails.images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <Image src={image} alt={`Image ${index + 1}`} className="d-block w-100" />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <div
                            dangerouslySetInnerHTML={{ __html: marked(postDetails.body_html) }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button className="btn btn-light" onClick={handleCopyUrl}>
                                Copy URL
                            </button>
                            <button className="btn btn-primary" onClick={handleLike}>
                                {isLiked ? "Unlike" : "Like"}
                            </button>
                            <button className="btn btn-secondary" onClick={handleGoToComments}>
                                Go to comments
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className="comments-section" id="comment">
                        <h3>Comments</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="comment" className="form-label">Leave a comment</label>
                                <textarea className="form-control" id="comment" rows="3" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                        {commentResponseState.loading && (
                            <div className="text-center">
                                <LoaderComponent />
                            </div>
                        )}
                        {commentResponseState.error && (
                            <Alert variant="danger">
                                {commentResponseState.error}
                            </Alert>
                        )}
                        {commentResponseState.success && (
                            <Alert variant="success">
                                {commentResponseState.success}
                            </Alert>
                        )}
                        <div className="comments-list">
                            {postDetails.comments.map(comment => (
                                <div key={comment._id} className="comment-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{comment.user.username}</h5>
                                            <p className="mb-0">{dateFormat(comment.createdAt, "longDate")}</p>
                                            <p className="mb-0">{comment.text}</p>
                                        </div>
                                        <button
                                            className="btn btn-light"
                                            onClick={() => handleCommentLike(comment._id)}
                                        >
                                            {isCommentLiked ? "Unlike" : "Like"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-3">
                        <h2>Related Articles</h2>
                        {postsLoading ? (
                            <div className="text-center">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            posts.map(post => (
                                <BlogForListPageComponent key={post._id} post={post} />
                            ))
                        )}
                    </div>
                    <div className="mt-3">
                        <TabContext value={tabValue}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    <Tab label="Summary" value="1" />
                                    <Tab label="Original" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                {isSummaryLoading ? (
                                    <div className="text-center">
                                        <LoaderComponent />
                                    </div>
                                ) : (
                                    <p>{summaryText}</p>
                                )}
                            </TabPanel>
                            <TabPanel value="2">
                                <div
                                    dangerouslySetInnerHTML={{ __html: marked(postDetails.body_html) }}
                                />
                            </TabPanel>
                        </TabContext>
                    </div>
                    <ScrollToTop />
                </>
            )}
        </div>
    )
}

export default BlogDescriptionPage
