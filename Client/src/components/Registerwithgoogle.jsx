import React from 'react';
import './Signinwithgoogle.css';
import Google from '../assets/google.png';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "./firebase"
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';

const RegisterButton = () => {
    const dispatch = useDispatch()

    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (result) => {
            console.log(result);
            if (result.user) {
                const user = {
                    ...result.user, 
                    name: result.user.displayName.split(' ')[0],
                    lastname: result.user.displayName.split(' ')[1]
                }
                localStorage.setItem("userInfo", JSON.stringify(user))
                dispatch(setRedxUserState(user))
                toast.success("User logged in successfully", { postion: "top-center" });
                window.location.href = "/";
            }
        })
    }

    return (
        <button className="custom-button" onClick={googleLogin}>
            <img src={Google} alt="Google logo" className="button-icon" />
            Register with Google
        </button>
    );
};

export default RegisterButton;
