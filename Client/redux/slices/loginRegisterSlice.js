import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userInfoInLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo"))
        : {}

export const loginRegisterSlice = createSlice({
    name: "Handling_Login",
    initialState: {
        userInfo: userInfoInLocalStorage
    },
    reducers: {
        setRedxUserState(state, action) {
            state.userInfo = {
                ...state.userInfo, ...action.payload
            }
        },
        logOutUser(state, action) {
            axios.get('/api/logout')
                .then(response => {
                    localStorage.removeItem("userInfo");
                    sessionStorage.removeItem("userInfo");
                    state.userInfo = {};
                    window.location.href = "/login"; // Redirect to the login page
                })
                .catch(error => {
                    console.error("Logout error:", error);
                    localStorage.removeItem("userInfo");
                    sessionStorage.removeItem("userInfo");
                    state.userInfo = {};
                    window.location.href = "/login"; // Redirect to the login page
                });
        }
    }
})

export const { setRedxUserState, logOutUser } = loginRegisterSlice.actions
export default loginRegisterSlice.reducer
