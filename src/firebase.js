import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';


export const getAllProjects = async () => {
  try {
    const projectsCollection = firestore.collection('projects');
    const projectsSnapshot = await getDocs(projectsCollection);
    const projects = projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return projects;
  } catch (error) {
    console.error('Error getting projects from Firestore:', error.message);
    return [];
  }
};

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyC2K_6C_-d_Oi-3k3Lp_ZCHpGht9B00z6Q",
authDomain: "wowo-f8a1d.firebaseapp.com",
databaseURL: "https://wowo-f8a1d.firebaseio.com",
projectId: "wowo-f8a1d",
storageBucket: "wowo-f8a1d.appspot.com",
messagingSenderId: "487107377523",
appId: "1:487107377523:web:2a6d4d4af6e7d8a4b8ed06",
measurementId: "G-643V7WX8K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

export const auth = getAuth();
export const firestore = getFirestore(app);
export default app;