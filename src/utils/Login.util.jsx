// Log in utility functions
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../firebase/firebase.config";

const auth = getAuth();

// Function to monitor authentication state
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

// Function to sign in a user with email and password
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

// Function to sign out the current user
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error(`Logout failed: ${error.message}`);
  }
};
