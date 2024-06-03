import { configureStore } from "@reduxjs/toolkit";
import loginRegisterSlice from "./slices/loginRegisterSlice";

const store = configureStore({
    reducer: {
        userLoggedIn: loginRegisterSlice
    }
})

export default store