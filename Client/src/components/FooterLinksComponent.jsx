import React, { useEffect, useState } from 'react'
import { Alert, Breadcrumb, Carousel, Image, Spinner } from 'react-bootstrap'
const FooterLinksComponent = () => {
    const [posts, setPosts] = useState([])
    const apiUrl = import.meta.env.VITE_API_URI;
    const fetchArticles = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/blogs`)
            return data
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchArticles().then(data => setPosts(data.posts))
            .catch(error => console.log(error))
    }, [])
    return (
        <div>
            <div className="sidebar d-flex bg-white">
                {
                    postDetails && (
                        <>
                            <div className="icon d-flex flex-column align-items-center py-2">
                                {postDetails.likedBy && !postDetails.likedBy.includes(userInfo._id) ? (
                                    <span className="cursor-pointer hover:text-[#ff6154]">
                                        <i onClick={handleLike} className="ri-heart-add-line"></i>
                                    </span>
                                ) : (
                                    <span className="cursor-pointer hover:text-[#ff6154]">
                                        <i onClick={handleLike} className="ri-heart-add-fill"></i>
                                    </span>
                                )
                                }
                                {/* {console.log(userInfo)} */}
                                {postDetails.postLikes}
                            </div>
                            <div className="icon d-flex flex-column align-items-center py-2">
                                <i onClick={handleGoToComments} className="ri-chat-3-line"></i>
                                {postDetails.reviews && postDetails.reviews.length}
                            </div>
                            <div className="icon py-2">
                                <i onClick={handleCopyUrl} className="ri-file-copy-fill"></i>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default FooterLinksComponent
