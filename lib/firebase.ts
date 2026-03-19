import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

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
// Enable offline persistence so writes are queued even without network
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
export const googleProvider = new GoogleAuthProvider();