// src/Auth.js
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fireSignOut } from "firebase/auth";

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
  } catch (error) {
    console.error('Error signing up:', error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
  } catch (error) {
    console.error('Error signing in:', error.message);
  }
};

export const signOut = async () => {
  try {
    await fireSignOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
};