import React, { useEffect, useState } from 'react'
import BlogForListComponent2 from '../components/BlogForListComponent2'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Col, Row } from 'react-bootstrap'
import PaginationComponent from '../components/PaginationComponent'

const BlogSpecificPage = () => {
    let { tag } = useParams()
    const [tagSpecificPosts, setTagSpecificPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalpaginationLinks, settotalpaginationLinks] = useState(1)

    const apiUrl = import.meta.env.VITE_API_URI;

    const searchTagData = async (tag, currentPage) => {
        // console.log(tag)
        const { data } = await axios.get(`${apiUrl}/api/blogs?q=${tag}&pageNum=${currentPage}`, {
            withCredentials: true,
        })
        return data
    }

    useEffect(() => {
        searchTagData(tag, currentPage).then(data => { 
            setTagSpecificPosts(data.posts)
            settotalpaginationLinks(data.paginationLinksNumber)
            setCurrentPage(data.pageNum)
        })
    }, [tag, currentPage])

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className='blog-page'>
            {/* {console.log(tagSpecificPosts)} */}
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
            {/* {console.log(totalpaginationLinks)} */}

            <PaginationComponent currentPage={currentPage}
                paginationLinksNumber={totalpaginationLinks}
                onPageChange={handlePageChange} />
        </div>
    )
}

export default BlogSpecificPage
