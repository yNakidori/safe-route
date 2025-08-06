
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children, requireProfileComplete = false }) {
  const { user, loading } = useAuth();
  const [profile, setProfile] = React.useState(null);
  const [profileLoading, setProfileLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { getFirestore, doc, getDoc } = await import("firebase/firestore");
          const db = getFirestore();
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          setProfile(docSnap.exists() ? docSnap.data() : {});
        } catch (e) {
          setProfile({});
        }
      }
      setProfileLoading(false);
    };
    if (user && requireProfileComplete) fetchProfile();
    else setProfileLoading(false);
  }, [user, requireProfileComplete]);

  if (loading || (requireProfileComplete && profileLoading)) return null;
  if (!user) return <Navigate to="/" />;

  if (requireProfileComplete) {
    const isProfileComplete = user.displayName && profile?.phone?.trim() && profile?.address?.trim();
    if (!isProfileComplete) {
      return <Navigate to="/completar-perfil" />;
    }
  }

  return children;
}
