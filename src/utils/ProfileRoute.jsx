import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase/firebase.config";

const db = getFirestore(app);

export default function ProfileRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserExists(true);
          const data = userSnap.data();
          setIsComplete(data.isProfileComplete === true);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (!userExists) return <Navigate to="/login" />;
  if (!isComplete) return <Navigate to="/completar-perfil" />;
  return children;
}
