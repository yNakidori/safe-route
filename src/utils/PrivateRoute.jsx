import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase/firebase.config";

const db = getFirestore(app);

export default function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [redirectToProfile, setRedirectToProfile] = useState(false);


}

// export default function PrivateRoute({ children }) {
//     const { user, loading } = useAuth();

//     if (loading) return <p>Carregando...</p>

//     return user ? children : <Navigate to="/login" />;
// }