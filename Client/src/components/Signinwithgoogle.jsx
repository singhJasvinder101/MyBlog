import React from 'react';
import './Signinwithgoogle.css';
import Google from '../assets/google.png'; 
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {auth} from "./firebase"

const SignInButton = () => {
function googleLogin(){
    const provider=new GoogleAuthProvider();
    signInWithPopup(auth,provider).then(async(result)=>{
        console.log(result);
        if(result.user){
            toast.success("User logged in successfully",{postion:"top-center"});
            window.location.href="/profile";
        }
    })
}

    return (
        <button className="custom-button" onClick={googleLogin}>
            <img src={Google} alt="Google logo" className="button-icon" />
            Sign In with Google
        </button>
    );
};

export default SignInButton;
