import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import { useHistory } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URI;

const userInfoInLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo"))
        : {}

export const logOutUser = createAsyncThunk("user/logout", async (payload, thunkAPI) => {
    try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${apiUrl}/api/logout`, {
            withCredentials: true,
        });
        // let userInfo = thunkAPI.getState().userLoggedIn.userInfo
        if (data === "access token cleared") {
            localStorage.removeItem("userInfo");
            sessionStorage.removeItem("userInfo");
            window.location.href = "/login"
            thunkAPI.dispatch(setRedxUserState({}));
        }
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
});

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(logOutUser.pending, (state) => {
                state.userInfo = {};
            })
            .addCase(logOutUser.fulfilled, (state) => {
                state.userInfo = {};
            })
            .addCase(logOutUser.rejected, (state) => {
                state.userInfo = {};
            });
    }
})

export const { setRedxUserState } = loginRegisterSlice.actions
export default loginRegisterSlice.reducer
