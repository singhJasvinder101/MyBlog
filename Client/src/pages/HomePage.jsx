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
    const [isLoading, setIsLoading] = useState(true)

    const apiUrl = import.meta.env.VITE_API_URI;

    const fetchArticles = async () => {
        try {
            // console.log(axios.get("/api/blogs").then(data => "url verified"))
            const { data } = await axios.get(`${apiUrl}/api/blogs`)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(apiUrl)

    useEffect(() => {
        fetchArticles().then(data => {
            setPosts(data.posts)
            setIsLoading(false)
        })
            .catch(error => console.log(error))
    }, [])

    // useEffect(() => {
    //     setTimeout(() => {
    //         setIsLoading(false)
    //     }, 2000);
    // }, [])

    return (
        <>
            {/* {console.log(posts)} */}
            <div className="home">
                {isLoading ? (
                    <>
                        <div className="spinnerContainer">
                            <div className="spinner"></div>
                            <div className="loader">
                                <p>loading</p>
                                <div className="words">
                                    <span className="word">posts</span>
                                    <span className="word">images</span>
                                    <span className="word">followers</span>
                                    <span className="word">hashtags</span>
                                    <span className="word">posts</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="banner">
                            <BestPostHeader />
                        </div>
                        <Row
                            className='mb-2 home-cards d-flex justify-content-between align-items-center mx-3'
                        >
                            {/* {console.log(searchResults)} */}
                            {
                                posts
                                    .filter(post => {
                                        const excludedIds = ["64d361430b96fbb0ea77c3d6", "64d361430b96fbb0ea77c3dc", "64d361430b96fbb0ea77c3e8"];
                                        return !excludedIds.includes(post._id.toString());
                                    })
                                    .slice(0, 9).map((post, idx) => (
                                        <BlogForListPageComponent post={post} key={idx} />
                                    ))
                            }
                            {
                                posts.slice(9, 30).map((post, idx) => (
                                    <BlogForListComponent2 post={post} key={idx + 10} />
                                ))
                            }
                        </Row>
                    </>
                )}
            </div>
        </>
    )
}

export default HomePage
