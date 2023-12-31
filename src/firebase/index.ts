// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import {
    CollectionReference,
    DocumentReference,
    collection,
    doc,
    getFirestore,
    connectFirestoreEmulator,
} from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import {
    getStorage,
    ref as storageRef,
    connectStorageEmulator,
} from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";
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
export const auth = getAuth(app);
export const fireStore = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
if (process.env.NODE_ENV == "development") {
    firebaseConfig.authDomain = "localhost";
    // firebaseConfig.apiKey = 'YOUR_API_KEY';
    connectFirestoreEmulator(fireStore, "127.0.0.1", 8080);
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
}
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
export function getStorageRef(...paths: string[]) {
    return storageRef(storage, paths.join("/"));
}
