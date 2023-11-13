// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";

let firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyDuI2roFqIlzYsbqvU8EiYrGTWzK4pym7Y",
    authDomain: "coursessite-d6e57.firebaseapp.com",
    projectId: "coursessite-d6e57",
    storageBucket: "coursessite-d6e57.appspot.com",
    messagingSenderId: "971737680842",
    appId: "1:971737680842:web:42f8a81795649733d01d33",
    measurementId: "G-6VBEPJFKY6",
};
export const app = initializeApp(firebaseConfig);
