// Log in utility functions
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { app } from "../firebase/firebase.config";
import firebaseErrorsMessages from "./FirebaseErrorMessages";
import toast from "react-hot-toast";

const auth = getAuth();
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

function getFirebaseErrorMessage(error) {
  return firebaseErrorsMessages(error);
}

// Function to monitor authentication state
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

export const login = async (email, password) => {
  return toast.promise(
    (async () => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const profile = userDoc.exists() ? userDoc.data() : {};

      const isProfileComplete =
        user.displayName && profile?.phone?.trim() && profile?.address?.trim();

      return { user, isProfileComplete };
    })(),
    {
      loading: "Logando...",
      success: "Logado com sucesso!",
      error: (err) => getFirebaseErrorMessage(err),
    }
  );
};

// Function to sign in with Google
export const loginWithGoogle = async () => {
  return toast.promise(
    (async () => {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const profile = userDoc.exists() ? userDoc.data() : {};

      // For Google login, we might need to create the user profile if it doesn't exist
      // The display name is usually available from Google
      const isProfileComplete =
        user.displayName && profile?.phone?.trim() && profile?.address?.trim();

      return { user, isProfileComplete };
    })(),
    {
      loading: "Fazendo login com Google...",
      success: "Login com Google realizado com sucesso!",
      error: (err) => getFirebaseErrorMessage(err),
    }
  );
};

// Function to sign out the current user
export const logout = async () => {
  return toast.promise(
    async () => {
      await signOut(auth);
    },
    {
      loading: "Deslogando...",
      success: "Deslogado com sucesso!",
      error: (err) => getFirebaseErrorMessage(err),
    }
  );
};
