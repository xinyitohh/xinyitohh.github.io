import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCia3ogG0B-4AN3e_XpuyGmWD2i_IMpJBE",
  authDomain: "website-da110.firebaseapp.com",
  projectId: "website-da110",
  storageBucket: "website-da110.firebasestorage.app",
  messagingSenderId: "549369739894",
  appId: "1:549369739894:web:6e4c56fd149376be9cbd57",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
