import { getFirestore, doc, addDoc, deleteDoc, getDoc, setDoc, query, where, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDhIBZXSBVIUkY3j5QHm_dw6i7GK6zkYAk",
    authDomain: "elite-air-369616.firebaseapp.com",
    projectId: "elite-air-369616",
    storageBucket: "elite-air-369616.appspot.com",
    messagingSenderId: "88167872801",
    appId: "1:88167872801:web:f862dec8ad272853d02660",
    measurementId: "G-D8MTQ9NY3M"
};
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
  
export {app, db, doc, addDoc, setDoc, query, where, collection, deleteDoc, getDoc, getDocs}
  