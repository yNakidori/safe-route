// Log in utility functions
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { app } from "../firebase/firebase.config";

const auth = getAuth();
const db = getFirestore(app);

// Function to monitor authentication state
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const profile = userDoc.exists() ? userDoc.data() : {};

     const isProfileComplete =
      user.displayName && profile?.phone?.trim() && profile?.address?.trim();

      return { user, isProfileComplete };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

// Function to sign out the current user
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};
