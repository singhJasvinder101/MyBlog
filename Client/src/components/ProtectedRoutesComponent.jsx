import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../redux/slices/loginRegisterSlice';

const ProtectedRoutesComponent = () => {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
    const userInfo = useSelector((state) => state.userLoggedIn.userInfo);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URI;
    const dispatch = useDispatch();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/api/get-token`, {
                    withCredentials: true,
                });

                if (data.token) {
                    setIsCheckingAuth(false);
                } else {
                    dispatch(logOutUser());
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('Error checking token:', error);
                dispatch(logOutUser());
                navigate('/login', { replace: true });
            }
        };

        checkToken();
    }, [apiUrl, dispatch, navigate]);

    if (isCheckingAuth) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
};

export default ProtectedRoutesComponent;
