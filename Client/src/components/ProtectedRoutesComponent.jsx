import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { useDispatch } from "react-redux";
import { logOutUser, setRedxUserState } from "../../redux/slices/loginRegisterSlice";

const ProtectedRoutesComponent = () => {
    const [isAuth, setIsAuth] = useState(false);

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URI;
    const dispatch = useDispatch()

    useEffect(() => {
        const check_token = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/api/get-token`, {
                    withCredentials: true,
                })
                if (data.token) {
                    setIsAuth(true)
                } else {
                    setIsAuth(false)
                    dispatch(logOutUser());
                }
            } catch (error) {
                console.log(error);
                setIsAuth(false);
                dispatch(logOutUser())
            }
        }
        setTimeout(() => {
            check_token()
        }, 1000);
    }, [isAuth]);

    if (isAuth === undefined) return <LoginPage />;
    if (isAuth) {
        return <Outlet />;
    } else {
        navigate("/login");
        return null;
    }
};

export default ProtectedRoutesComponent;
