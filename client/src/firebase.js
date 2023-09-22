// Firebase service file
import firebaseConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

