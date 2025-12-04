import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgQRK5ZLDZfDYsDQIGXEr4PgqNrwqsJkQ",
  authDomain: "samfit-c8333.firebaseapp.com",
  projectId: "samfit-c8333",
  storageBucket: "samfit-c8333.firebasestorage.app",
  messagingSenderId: "271272166488",
  appId: "1:271272166488:web:35ace54de59f75e689762d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);