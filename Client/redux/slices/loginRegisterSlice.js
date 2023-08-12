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

            // solving error of pageNot found
            axios.get('/api/logout')
                .then(response => {
                    localStorage.removeItem("userInfo");
                    sessionStorage.removeItem("userInfo");
                    window.location.href = "/login"; 
                    return {
                        ...state,
                        userInfo: {}
                    };
                })
                .catch(error => {
                    console.error("Logout error:", error);
                    localStorage.removeItem("userInfo");
                    sessionStorage.removeItem("userInfo");
                    window.location.href = "/login"; 
                    return {
                        ...state,
                        userInfo: {} 
                    };
                });
        }
    }
})

export const { setRedxUserState, logOutUser } = loginRegisterSlice.actions
export default loginRegisterSlice.reducer
