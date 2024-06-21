// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGE5hPjtjgf5kX-XRBtKlaAIVZ3fXolos",
  authDomain: "techblog-e1208.firebaseapp.com",
  projectId: "techblog-e1208",
  storageBucket: "techblog-e1208.appspot.com",
  messagingSenderId: "725903233624",
  appId: "1:725903233624:web:a826b8f9f3a9790d7f702d",
  measurementId: "G-7Z4F1HM4X3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;