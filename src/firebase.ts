// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    CollectionReference,
    DocumentReference,
    Firestore,
    collection,
    doc,
    getFirestore,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { DataBase } from "./data";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDuI2roFqIlzYsbqvU8EiYrGTWzK4pym7Y",
    authDomain: "coursessite-d6e57.firebaseapp.com",
    projectId: "coursessite-d6e57",
    storageBucket: "coursessite-d6e57.appspot.com",
    messagingSenderId: "971737680842",
    appId: "1:971737680842:web:42f8a81795649733d01d33",
    measurementId: "G-6VBEPJFKY6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const fireStore = getFirestore(app);
// export const analytics = getAnalytics(app);
export function createCollection<T extends keyof DataBase>(path: T) {
    return collection(fireStore, path) as CollectionReference<DataBase[T]>;
}
export function getDocRef<T extends keyof DataBase>(
    path: T,
    ...pathFragments: string[]
) {
    
    return doc(fireStore, path, ...pathFragments) as DocumentReference<
        DataBase[T]
    >;
}
