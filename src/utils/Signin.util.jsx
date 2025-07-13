// Sign in utility functions
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import app from "../firebase/firebase.config";

const auth = getAuth();

// Function to monitor authentication state
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

// Funtion to register a new user with email and password
export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};
