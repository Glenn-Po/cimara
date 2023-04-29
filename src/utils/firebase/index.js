// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { collection, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmG6iIhlPeVjsVxjZ96rUqLiT-Zz0cBLc",
  authDomain: "cimara.firebaseapp.com",
  projectId: "cimara",
  storageBucket: "cimara.appspot.com",
  messagingSenderId: "848113756785",
  appId: "1:848113756785:web:12de78cdac6dc99fb3c9d0",
  measurementId: "G-237X32WJ2L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const attendRef = collection(db, "attendance");
const usersRef = collection(db, "users");
const locationsRef = collection(db, "locations");

const qrStoreRef = ref(storage, "qrCodes");

export {
  analytics,
  auth,
  db,
  storage,
  attendRef,
  usersRef,
  locationsRef,
  qrStoreRef,
};
