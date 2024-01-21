import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

// Function to get all projects from Firestore
export const getAllProjects = async () => {
  try {
    const projectsCollection = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsCollection);
    const projects = projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('All Projects:', projects);
    return projects;
  } catch (error) {
    console.error('Error getting projects from Firestore:', error.message);
    return [];
  }
};

export const getUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data();
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error.message);
    return null;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, userData, { merge: true });
      console.log('User profile updated successfully');
    }
  } catch (error) {
    console.error('Error updating user profile:', error.message);
  }
};

export const getAllTags = async () => {
  try {
    const projectsCollection = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsCollection);
    const tags = new Set();

    projectsSnapshot.docs.forEach((doc) => {
      const projectTags = doc.data().tags;
      projectTags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags);
  } catch (error) {
    console.error('Error getting tags from Firestore:', error.message);
    return [];
  }
};

export const getUserProjects = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
      const projectsSnapshot = await getDocs(q);
      const projects = projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return projects;
    } else {
      console.error('User not authenticated');
      return [];
    }
  } catch (error) {
    console.error('Error getting user projects from Firestore:', error.message);
    return [];
  }
};

// Add a project to Firestore
const addProject = async (project) => {
  try {
    // Add the project to Firestore
    const docRef = await addDoc(collection(db, "projects"), project);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Upload a file to Firebase Storage
const uploadFile = async (file) => {
  const storageRef = ref(storage, file.name);

  await uploadBytesResumable(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);

  return fileUrl;
};

export { addProject }

// Other functions for updating and deleting projects, handling user authentication, and working with files remain the same