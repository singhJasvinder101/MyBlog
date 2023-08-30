// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';

const Sidebar = ({ popularArticles, userDetails, postId }) => {
    return (
        <>
            {/* <UserProfile userDetails={userDetails} postId={postId} /> */}
            <h4>Popular Articles</h4>
            <ul>
                {popularArticles.map((article, index) => (
                    <li key={index}>
                        <Link to={`/post-details/${article._id}`} >
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Sidebar;
