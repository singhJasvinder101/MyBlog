import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import BlogForListPageComponent from '../components/BlogForListPageComponent';
import BestPostHeader from '../components/BestPostHeader';
import BlogForListComponent2 from '../components/BlogForListComponent2';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import LoaderComponent from './components/LoaderComponent';
import { useQuery } from '@tanstack/react-query';



const HomePage = ({ setIsLoading }) => {
    
    const location = useLocation();
    const searchResults = location.state?.searchResults || [];
    const apiUrl = import.meta.env.VITE_API_URI;
    console.log("localhost: ", apiUrl);
    const fetchArticles = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/blogs`);
            return data.posts;
        } catch (error) {
            throw new Error('Failed to fetch articles');
        }
    };

    const { data: posts, status, isLoading, isError, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchArticles,
        onSuccess: () => {
            setIsLoading(false);
        },
        staleTime: 1000 * 60 * 60 * 24,
    });

    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading, setIsLoading]);

    if (isError) {
        return (
            <div className='text-center'>
                <h1 className='font-italic'>Failed to load articles 😞</h1>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <>
            <div className="home">
                <>
                    <div className="banner">
                        <BestPostHeader setIsLoading={setIsLoading} />
                    </div>
                    <Row className='home-cards d-flex justify-content-between align-items-center mx-3'>
                        {posts &&
                            posts.filter(post => {
                                const excludedIds = ["64d361430b96fbb0ea77c3d6", "64d361430b96fbb0ea77c3dc", "64d361430b96fbb0ea77c406", "64d361430b96fbb0ea77c3e8"];
                                return !excludedIds.includes(post._id.toString());
                            })
                            .slice(0, 9).map((post, idx) => (
                                <BlogForListPageComponent post={post} key={idx} />
                            ))
                        }
                        {posts &&
                            posts.slice(9, 30).map((post, idx) => (
                                <BlogForListComponent2 post={post} key={idx + 10} />
                            ))
                        }
                    </Row>
                </>
            </div>
        </>
    );
}

export default HomePage;
