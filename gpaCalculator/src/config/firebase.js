import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {

	apiKey: "AIzaSyCG5uSdPoZd2kCHs7ItvGBpLWv_IxndG-U",
  
	authDomain: "gradevault-2bc47.firebaseapp.com",
  
	projectId: "gradevault-2bc47",
  
	storageBucket: "gradevault-2bc47.firebasestorage.app",
  
	messagingSenderId: "833098953489",
  
	appId: "1:833098953489:web:b3a8a0380781e510dfd2b0",
  
	measurementId: "G-7JX4139PC0"
  
  };

  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, analytics, db };



