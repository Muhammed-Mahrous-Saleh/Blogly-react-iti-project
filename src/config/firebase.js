import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBkyg_ihWL9YgvqVKZvfJTFne9fmaf6T7E",
    authDomain: "iti-react-blog-pro.firebaseapp.com",
    projectId: "iti-react-blog-pro",
    storageBucket: "iti-react-blog-pro.appspot.com",
    messagingSenderId: "937705675029",
    appId: "1:937705675029:web:81e0125293bbd96e9db11c",
    measurementId: "G-4YGEK6B2DH",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
