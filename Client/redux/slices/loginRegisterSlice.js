import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useHistory } from "react-router-dom";

const userInfoInLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo"))
        : {}

export const logOutUser = createAsyncThunk("user/logout", async (_, { dispatch }) => {
    try {
        await axios.get("/api/logout");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("userInfo");
        dispatch(setRedxUserState({}));
        window.location.href = '/login';
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
