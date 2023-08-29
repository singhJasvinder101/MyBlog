import React, { useEffect, useState } from 'react'
import './UserProfileCard.css'
import axios from 'axios'
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const UserProfile = ({ userDetails, postId }) => {
    const apiUrl = import.meta.env.VITE_API_URI;
    const userId = useSelector(state => state.userLoggedIn.userInfo._id)

    const [followUserResponseState, setFollowUserResponseState] = useState({
        error: "",
        loading: false,
    })
    const [isFollowed, setIsFollowed] = useState(false)
    const [postOwnerDetails, setPostOwnerDetails] = useState([])
    const [currentFollowers, setCurrentFollowers] = useState(0) 

    const author = userDetails.author
    const fetchOwnerDetails = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/users/blog/owner/${author}`, {
                withCredentials: true,
            });
            return data;
        } catch (error) {
            console.log("Error fetching post details:", error);
            return null;
        }
    }
    // console.log(userDetails.author)

    useEffect(() => {
        fetchOwnerDetails().then(data => {
            setTimeout(() => {
                setPostOwnerDetails(data.user)
                setCurrentFollowers(data.user.followedBy.length)
                // console.log(data)
            }, 100);
        }).catch(err => {
            console.log(err)
        })
    }, [isFollowed, postId, author]);

    // console.log(postOwnerDetails)
    // console.log(currentFollowers)

    const handleFollowUser = async (username) => {
        setFollowUserResponseState({ loading: true })
        try {
            const { data } = await axios.get(`${apiUrl}/api/users/follow/${decodeURI(username)}`, {
                withCredentials: true,
            })
            if (data.success) {
                setFollowUserResponseState({
                    loading: false,
                })
                setIsFollowed(prevIsFollowed => !prevIsFollowed);
            }
        } catch (error) {
            // console.log(error)
            setFollowUserResponseState({
                loading: true,
                error: error.response.data.message ? error.response.data.message : error.response.data,
                followed: false
            })
        }
    }
    return (
        <div>
            {
                userDetails && (
                    <div div className="right-card">
                        {/* {console.log(postOwnerDetails.data.user.followedBy)} */}
                        <div className="card__img"></div>
                        <div className="card__avatar">
                            {/* <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" fill="#ff8475" r="60"></circle><circle cx="64" cy="64" fill="#f85565" opacity=".4" r="48"></circle><path d="m64 14a32 32 0 0 1 32 32v41a6 6 0 0 1 -6 6h-52a6 6 0 0 1 -6-6v-41a32 32 0 0 1 32-32z" fill="#7f3838"></path><path d="m62.73 22h2.54a23.73 23.73 0 0 1 23.73 23.73v42.82a4.45 4.45 0 0 1 -4.45 4.45h-41.1a4.45 4.45 0 0 1 -4.45-4.45v-42.82a23.73 23.73 0 0 1 23.73-23.73z" fill="#393c54" opacity=".4"></path><circle cx="89" cy="65" fill="#fbc0aa" r="7"></circle><path d="m64 124a59.67 59.67 0 0 0 34.69-11.06l-3.32-9.3a10 10 0 0 0 -9.37-6.64h-43.95a10 10 0 0 0 -9.42 6.64l-3.32 9.3a59.67 59.67 0 0 0 34.69 11.06z" fill="#4bc190"></path><path d="m45 110 5.55 2.92-2.55 8.92a60.14 60.14 0 0 0 9 1.74v-27.08l-12.38 10.25a2 2 0 0 0 .38 3.25z" fill="#356cb6" opacity=".3"></path><path d="m71 96.5v27.09a60.14 60.14 0 0 0 9-1.74l-2.54-8.93 5.54-2.92a2 2 0 0 0 .41-3.25z" fill="#356cb6" opacity=".3"></path><path d="m57 123.68a58.54 58.54 0 0 0 14 0v-25.68h-14z" fill="#fff"></path><path d="m64 88.75v9.75" fill="none" stroke="#fbc0aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="14"></path><circle cx="39" cy="65" fill="#fbc0aa" r="7"></circle><path d="m64 91a25 25 0 0 1 -25-25v-16.48a25 25 0 1 1 50 0v16.48a25 25 0 0 1 -25 25z" fill="#ffd8c9"></path><path d="m91.49 51.12v-4.72c0-14.95-11.71-27.61-26.66-28a27.51 27.51 0 0 0 -28.32 27.42v5.33a2 2 0 0 0 2 2h6.81a8 8 0 0 0 6.5-3.33l4.94-6.88a18.45 18.45 0 0 1 1.37 1.63 22.84 22.84 0 0 0 17.87 8.58h13.45a2 2 0 0 0 2.04-2.03z" fill="#bc5b57"></path><path d="m62.76 36.94c4.24 8.74 10.71 10.21 16.09 10.21h5" style={{ fill: 'none', strokeLinecap: 'round', stroke: '#fff', strokeMiterlimit: 10, strokeWidth: 2, opacity: .1 }}></path><path d="m71 35c2.52 5.22 6.39 6.09 9.6 6.09h3" style={{ fill: 'none', strokeLinecap: 'round', stroke: '#fff', strokeMiterlimit: 10, strokeWidth: 2, opacity: .1 }}></path><circle cx="76" cy="62.28" fill="#515570" r="3"></circle><circle cx="52" cy="62.28" fill="#515570" r="3"></circle><ellipse cx="50.42" cy="69.67" fill="#f85565" opacity=".1" rx="4.58" ry="2.98"></ellipse><ellipse cx="77.58" cy="69.67" fill="#f85565" opacity=".1" rx="4.58" ry="2.98"></ellipse><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m64 67v4" stroke="#fbc0aa" stroke-width="4"></path><path d="m55 56h-9.25" opacity=".2" stroke="#515570" stroke-width="2"></path><path d="m82 56h-9.25" opacity=".2" stroke="#515570" stroke-width="2"></path></g><path d="m64 84c5 0 7-3 7-3h-14s2 3 7 3z" fill="#f85565" opacity=".4"></path><path d="m65.07 78.93-.55.55a.73.73 0 0 1 -1 0l-.55-.55c-1.14-1.14-2.93-.93-4.27.47l-1.7 1.6h14l-1.66-1.6c-1.34-1.4-3.13-1.61-4.27-.47z" fill="#f85565"></path></svg> */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" />
                            </svg>
                        </div>
                        <div className="card__title">{userDetails.author}</div>
                        <div className="card__subtitle">Followers {currentFollowers}</div>
                        <div className="card__wrapper">
                            <button className="card__btn mx-3">View Profile</button>
                            {followUserResponseState.loading ? (
                                <button className="card__btn card__btn-solid">
                                    {/* {console.log(postOwnerDetails.followedBy && postOwnerDetails.followedBy.includes(userId))} */}
                                    <Spinner
                                        className='mx-2'
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true" />
                                </button>
                            ) : postOwnerDetails?.followedBy?.includes(userId) ? (
                                <button className="card__btn card__btn-solid" onClick={() => handleFollowUser(userDetails.author)}>Following</button>
                            ) : (
                                <button className="card__btn card__btn-solid" onClick={() => handleFollowUser(userDetails.author)}>Follow</button>
                            )
                            }

                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default UserProfile
