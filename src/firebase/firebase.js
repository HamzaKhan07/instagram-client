import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJvLWkkN7JJbI5Q5yYxIzIpCHXGGeiYvg",
  authDomain: "blog-85217.firebaseapp.com",
  projectId: "blog-85217",
  storageBucket: "blog-85217.appspot.com",
  messagingSenderId: "705836317688",
  appId: "1:705836317688:web:3f84b09f7db86744f4340d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;