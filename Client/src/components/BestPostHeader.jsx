import { Col, Image, Row } from "react-bootstrap";
import axios from "axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
} from "react-share";
import { useQuery } from "@tanstack/react-query";
function BestPostHeader({ setIsLoading }) {
    const apiUrl = import.meta.env.VITE_API_URI;

    const fetchArticles = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/blogs`);
            return data.posts;
        } catch (error) {
            throw new Error('Failed to fetch articles');
        }
    };

    const fetchPostDetails = async () => {
        const posts = await fetchArticles();
        const shuffled = posts.sort(() => 0.5 - Math.random());
        console.log(posts)
        console.log(shuffled)
        // const { data } = await axios.get(`${apiUrl}/api/blogs/get-one/6756ba28580ef004f60ce5b2`)
        return shuffled[0];
    }

    const { data: postDetails, postStatus: status, isLoading: postLoading, isError: postError, error: postErrorMessage } = useQuery({
        QueryKey: ['postsDetails'],
        queryFn: fetchPostDetails,
        // staletime: 1000 * 60 * 60 * 24,
    })

    const shareUrl = "https://tech-stuffs.netlify.app/"

    if (postError) {
        return <div className='text-center'>
            <h1 className='font-italic'>Failed to load article 😞</h1>
            <p>{postErrorMessage}</p>
        </div>
    }

    return (
        <>
            {postDetails && (
                <div className="best-posts">
                    <Row className="best-post-container m-auto py-5">
                        <Col className="left" md={6}>
                            <Link to={`/post-details/${postDetails?._id}`}>
                                <Image src={postDetails.images?.[0]?.path} alt="" fluid />
                            </Link>
                        </Col>
                        <Col className="right d-flex justify-content-center align-items-center" md={6}>
                            <div className="best-post-content">
                                <h1 className="pb-3">{postDetails.title}</h1>
                                <p>
                                    {postDetails.description}
                                </p>
                                <div className="social-icons d-flex">
                                    <LinkedinShareButton
                                        className="mx-1"
                                        url={shareUrl}
                                        title={postDetails.title}
                                        summary={postDetails.description && postDetails.description.slice(0, 30)}
                                    >
                                        <LinkedinIcon size={35} round={true} />
                                    </LinkedinShareButton>
                                    <WhatsappShareButton
                                        className="mx-1"
                                        url={shareUrl}
                                        title="hey!! let's join this tech blog for daily tech stuffs"
                                    >
                                        <WhatsappIcon size={35} round={true} />
                                    </WhatsappShareButton>
                                    <TwitterShareButton
                                        className="mx-1"
                                        url={shareUrl}
                                        title="hey!! let's join this tech blog for daily tech stuffs"
                                    >
                                        <TwitterIcon size={35} round={true} />
                                    </TwitterShareButton>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
        )}
        </>
    );
}

export default BestPostHeader;