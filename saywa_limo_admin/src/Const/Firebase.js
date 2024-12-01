// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu_YD9MMTdAW3bxASiebbJBNKd9rYhxA4",
  authDomain: "allblacklimo-ae6dd.firebaseapp.com",
  projectId: "allblacklimo-ae6dd",
  storageBucket: "allblacklimo-ae6dd.appspot.com",
  messagingSenderId: "947354195655",
  appId: "1:947354195655:web:1ab5ed4f56ee8728f0d0e2",
  measurementId: "G-GTGE7CJE17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      sessionStorage.setItem("email", result.user.email);
      sessionStorage.setItem("displayName", result.user.displayName);
      sessionStorage.setItem("photoURL", result.user.photoURL);
    })
    .catch((error) => {});
};
