import { configureStore } from "@reduxjs/toolkit";
import loginRegisterSlice from "./slices/loginRegisterSlice";

const store = configureStore({
    reducer: {
        userLoggedIn: loginRegisterSlice
    }
})
// console.log(store)

export default store