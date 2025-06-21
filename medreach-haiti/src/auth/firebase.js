// src/auth/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCzZPe6m8qxpfe-mZsGzDwTLOVmvM7-WoY",
  authDomain: "medreach-haiti.firebaseapp.com",
  projectId: "medreach-haiti",
  storageBucket: "medreach-haiti.appspot.com",
  messagingSenderId: "744365008806",
  appId: "1:744365008806:web:1c352dcf46a19877ae5167",
  measurementId: "G-1Q0J0KLK7V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 