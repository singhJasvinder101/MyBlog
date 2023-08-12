import { Col, Image, Row } from "react-bootstrap";
import axios from "axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BestPostHeader() {
    const [postDetails, setPostDetails] = useState({})
    const apiUrl = import.meta.env.VITE_API_URI;

    const fetchPostDetails = async () => {
        const { data } = await axios.get(`${apiUrl}/api/blogs/get-one/64d389ce616237b9dccef2d2`)
        return data
    }

    useEffect(() => {
        fetchPostDetails().then(data => {
            setPostDetails(data)
        }).catch(err => {
            console.log(err)
        })
    }, [])
    // console.log(postDetails)

    return (
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
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default BestPostHeader;