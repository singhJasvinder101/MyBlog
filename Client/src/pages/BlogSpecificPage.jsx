import React, { useEffect, useState } from 'react';
import BlogForListComponent2 from '../components/BlogForListComponent2';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import PaginationComponent from '../components/PaginationComponent';

const BlogSpecificPage = () => {
    let { tag } = useParams();
    const [tagSpecificPosts, setTagSpecificPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPaginationLinks, setTotalPaginationLinks] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URI;
    axios.defaults.withCredentials = true;

    const searchTagData = async (tag, currentPage) => {
        try {
            const { data } = await axios.get(`/api/blogs`, {
                params: { q: tag, pageNum: currentPage },
                withCredentials: true,
            });
            return data;
        } catch (error) {
            setError(error);
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        searchTagData(tag, currentPage)
            .then(data => {
                if (data) {
                    setTagSpecificPosts(data.posts);
                    setTotalPaginationLinks(data.paginationLinksNumber);
                    setCurrentPage(data.pageNum);
                }
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
            {error && <div className="alert alert-danger">Error: {error.message}</div>}
            <div className="blog-specific">
                <div className="blog-bg"></div>
                <div className="blog-heading">
                    {tag.charAt(0).toUpperCase() + tag.slice(1)} Blogs
                </div>
            </div>
            <div className="container-fluid">
                <Row className='mb-2 home-cards d-flex justify-content-between align-items-center mx-3'>
                    {tagSpecificPosts && tagSpecificPosts.map((post, idx) => (
                        <BlogForListComponent2 key={idx} post={post} />
                    ))}
                </Row>
            </div>
            {totalPaginationLinks > 1 && (
                <PaginationComponent 
                    currentPage={currentPage}
                    paginationLinksNumber={totalPaginationLinks}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default BlogSpecificPage;
