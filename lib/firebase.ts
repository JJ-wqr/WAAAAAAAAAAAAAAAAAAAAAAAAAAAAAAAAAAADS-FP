import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpQw_JpjN7gYwZ7LTNU7Wc-oJ40y4pKRA",
  authDomain: "linguiny-project-1.firebaseapp.com",
  projectId: "linguiny-project-1",
  storageBucket: "linguiny-project-1.firebasestorage.app",
  messagingSenderId: "864394093073",
  appId: "1:864394093073:web:742dbf4afe46901fd907b0"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();