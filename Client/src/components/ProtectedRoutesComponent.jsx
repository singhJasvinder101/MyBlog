import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { useDispatch, useSelector } from "react-redux";
import { logOutUser, setRedxUserState } from "../../redux/slices/loginRegisterSlice";
const ProtectedRoutesComponent = () => {
    const [isAuth, setIsAuth] = useState(false);
    const userInfo = useSelector((state) => state.userLoggedIn.userInfo);

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URI;
    const dispatch = useDispatch()

    const googleAuth = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        const check_token = async () => {
            try {
                axios.defaults.withCredentials = true;
                const { data } = await axios.get(`${apiUrl}/api/get-token`, {
                    withCredentials: true,
                })
                // console.log(data)
                // const data = userInfo
                // if (data.name) {
                console.log(data.token)
                if (data.token) {
                    setIsAuth(true)
                } else {
                    setIsAuth(false)
                    dispatch(logOutUser());
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log(isAuth)

        setTimeout(() => {
            check_token()
            setIsAuth(googleAuth.providerId === "firebase")
        }, 1000);
    }, [isAuth]);

    if (!isAuth) {
        navigate('/login');
        return null;
    }

    return <Outlet />;
};

export default ProtectedRoutesComponent;
