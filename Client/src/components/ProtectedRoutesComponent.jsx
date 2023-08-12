import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

const ProtectedRoutesComponent = () => {
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URI;

    useEffect(() => {
        fetch("http://localhost:3000/api/get-token", {
            method: "GET",
            credentials: "same-origin" // Include cookies
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    setIsAuth(data.token);
                } else {
                    console.log("Token not found in response data.");
                }
            })
            .catch(error => {
                console.log("Fetch error:", error);
                // Handle 401 status code (unauthorized) appropriately, e.g., navigate to login page
                if (error.message.includes("Status: 401")) {
                    navigate("/login");
                }
            });
    }, [navigate]);

    if (isAuth === undefined) return null;
    if (isAuth) {
        return <Outlet />;
    } else {
        navigate("/login");
        return null;
    }
};

export default ProtectedRoutesComponent;
