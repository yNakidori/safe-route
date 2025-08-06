import { useEffect, useState } from "react";
import {
  getAuth,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "../firebase/firebase.config";

const auth = getAuth(app);
const db = getFirestore(app);

export default function UserProfile() {
  const user = auth.currentUser;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email,
      }));

      // Get info from Firestore
      const fetchUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm((prev) => ({
            ...prev,
            phone: data.phone || "",
            address: data.address || "",
          }));
        }
        setLoading(false);
      };

      fetchUserData();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    try {
      if (user) {
        if (form.name !== user.email) {
          await updateEmail(user, form.email);
        }

        if (form.password) {
          await updatePassword(user, form.password);
        }

        await updateProfile(user, { displayName: form.name });

        //Save data
        await setDoc(doc(db, "users", user.uid), {
          phone: form.phone,
          address: form.address,
        });

        alert("Perfil atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil: " + error.message);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Seu Perfil</h2>

      <label className="block mb-2">
        Nome:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </label>

      <label className="block mb-2">
        Email:
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </label>

      <label className="block mb-2">
        Nova senha:
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Deixe em branco para manter"
        />
      </label>

      <label className="block mb-2">
        Telefone:
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </label>

      <label className="block mb-4">
        Endereço:
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </label>

      <button
        onClick={handleSave}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Salvar alterações
      </button>
    </div>
  );
}
