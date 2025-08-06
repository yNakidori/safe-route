import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useAuth } from "../utils/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      const extraData = docSnap.exists() ? docSnap.data() : {};

      setInitialValues({
        name: user.displayName || "",
        email: user.email || "",
        phone: extraData.phone || "",
        address: extraData.address || "",
        password: "",
      });
    };

    fetchData();
  }, [user]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Nome obrigatório"),
    email: Yup.string().email("Email inválido"). required("Email obrigatório"),
    password: Yup.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    phone: Yup.string(),
    address: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!user) return;

      if (values.email !== user.email) {
        await updateEmail(user, values.email);
      }

      if (values.password) {
        await updatePassword(user, values.password);
      }

      if (values.name !== user.displayName) {
        await updateProfile(user, { displayName: values.name });
      }

      await setDoc(doc(db, "users", user.uid), {
        phone: values.phone,
        address: values.address,
      });

      alert("Perfil atualizado com sucesso!");
      resetForm({ values: { ...values, password: "" } });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

 if (!initialValues) return <p className="text-center mt-10">Carregando perfil...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">Nome:</label>
              <Field
                name="name"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Email:</label>
              <Field
                name="email"
                type="email"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Nova senha:</label>
              <Field
                name="password"
                type="password"
                className="w-full border px-3 py-2 rounded"
                placeholder="Deixe em branco para manter"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Telefone:</label>
              <Field
                name="phone"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Endereço:</label>
              <Field
                name="address"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}