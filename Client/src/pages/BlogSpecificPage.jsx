import React, { useEffect, useState } from 'react';
import BlogForListComponent2 from '../components/BlogForListComponent2';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import PaginationComponent from '../components/PaginationComponent';
import ScrollToTopButton from './ScrollToTopButton'; 

const BlogSpecificPage = () => {
    let { tag } = useParams();
    const [tagSpecificPosts, setTagSpecificPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalpaginationLinks, settotalpaginationLinks] = useState(1);
    const [loading, setLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URI;
    axios.defaults.withCredentials = true;

    const searchTagData = async (tag, currentPage) => {
        const { data } = await axios.get(`${apiUrl}/api/blogs?q=${tag}&pageNum=${currentPage}`, {
            withCredentials: true,
        });
        return data;
    };

    useEffect(() => {
        setLoading(true);
        searchTagData(tag, currentPage)
            .then(data => {
                setTagSpecificPosts(data.posts);
                settotalpaginationLinks(data.paginationLinksNumber);
                setCurrentPage(data.pageNum);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tag, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className='blog-page'>
            <div className="blog-specific">
                <div className="blog-bg"></div>
                <div className="blog-heading">
                    Blogs
                </div>
            </div>
            <div className="container-fluid">
                <Row className='mb-2 home-cards d-flex justify-content-between align-items-center mx-3'>
                    {tagSpecificPosts && tagSpecificPosts.map((post, idx) => (
                        <BlogForListComponent2 key={idx} post={post} />
                    ))}
                </Row>
            </div>
            {totalpaginationLinks > 1 ? (
                <PaginationComponent currentPage={currentPage}
                    paginationLinksNumber={totalpaginationLinks}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            ) : null}
            <ScrollToTopButton /> 
        </div>
    );
};

export default BlogSpecificPage;

