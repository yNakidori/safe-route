// Sign in utility functions
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase/firebase.config";

const auth = getAuth(app);
const db = getFirestore(app);

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Criar um documento de perfil vazio para forçar o preenchimento
    await setDoc(doc(db, "users", user.uid), {
      email,
      name: "",
      phone: "",
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};