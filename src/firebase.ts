// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfAylz6PtNu8XmNPXxrtgykmSGntMwyp4",
  authDomain: "urlshortlink-96481.firebaseapp.com",
  projectId: "urlshortlink-96481",
  storageBucket: "urlshortlink-96481.appspot.com",
  messagingSenderId: "5802868344",
  appId: "1:5802868344:web:fcf46114c234971a37b78d",
  measurementId: "G-7WGY1GFLCK",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const database = getFirestore(firebaseApp);
export { auth, provider, database };
