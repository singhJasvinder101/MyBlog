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
  apiKey: "AIzaSyApgeD2FPWVlnyHLDfTUCurAtcsI2kzI5A",
  authDomain: "login1-f1059.firebaseapp.com",
  projectId: "login1-f1059",
  storageBucket: "login1-f1059.appspot.com",
  messagingSenderId: "228795249031",
  appId: "1:228795249031:web:f2ed414bb65b223a386322",
  measurementId: "G-E904EDNQK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;