// Sign in utility functions
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase/firebase.config";
import firebaseErrorsMessages from "./FirebaseErrorMessages";
import toast from "react-hot-toast";

const auth = getAuth(app);
const db = getFirestore(app);

function getFirebaseErrorMessage(error) {
  return firebaseErrorsMessages(error);
}

export const register = async (email, password) => {
  return toast.promise(
    (async () => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        name: "",
        phone: "",
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
      });

      return user;
    })(),
    {
      loading: "Registrando...",
      success: "Cadastro realizado com sucesso!",
      error: (err) => getFirebaseErrorMessage(err),
    }
  );
};
