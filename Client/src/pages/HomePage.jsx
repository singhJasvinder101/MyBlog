import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import BlogForListPageComponent from '../components/BlogForListPageComponent'
import BestPostHeader from '../components/BestPostHeader'
import BlogForListComponent2 from '../components/BlogForListComponent2'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const HomePage = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || [];
    const [posts, setPosts] = useState([])

    const apiUrl = import.meta.env.VITE_API_URI;

    const fetchArticles = async () => {
        try {
            // console.log(axios.get("/api/blogs").then(data => "url verified"))
            const { data } = await axios.get(`${apiUrl}/api/blogs`)
            return data
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(apiUrl)

    useEffect(() => {
        fetchArticles().then(data => setPosts(data.posts))
            .catch(error => console.log(error))
    }, [])

    return (
        <>
            {/* {console.log(posts)} */}
            <div className="home">
                <div className="banner">
                    <BestPostHeader />
                </div>
                <Row
                    className='mb-2 home-cards d-flex justify-content-between align-items-center mx-3'
                >
                    {/* {console.log(searchResults)} */}
                    {
                        posts.filter(x => x._id.toString() !== "64d361430b96fbb0ea77c3d6").slice(0, 9).map((post, idx) => (
                            <BlogForListPageComponent post={post} key={idx} />
                        ))
                    }
                    {
                        posts.slice(9, 30).map((post, idx) => (
                            <BlogForListComponent2 post={post} key={idx + 10} />
                        ))
                    }
                </Row>
            </div>
        </>
    )
}

export default HomePage
