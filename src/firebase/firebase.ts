// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBHAUpLBniVwkDSTWRicezDBe5BzzjrCc",
    authDomain: "invoice-gen-87c05.firebaseapp.com",
    projectId: "invoice-gen-87c05",
    storageBucket: "invoice-gen-87c05.appspot.com",
    messagingSenderId: "654929124258",
    appId: "1:654929124258:web:493a8984299b06aa36b0fb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
