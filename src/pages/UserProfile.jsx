import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { updateEmail, updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useAuth } from "../utils/AuthContext";
import CepSearch from "../utils/CepSearch";
import AddressPopover from "../utils/AddressPopover";
import toast, { Toaster } from "react-hot-toast";

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [addressData, setAddressData] = useState(null);

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
      });
    };

    fetchData();
  }, [user]);

  const checkPhoneExists = async (phone, currentUserId) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("phone", "==", phone));
      const querySnapshot = await getDocs(q);

      const existingUser = querySnapshot.docs.find(
        (doc) => doc.id !== currentUserId
      );
      return existingUser ? true : false;
    } catch (error) {
      console.error("Erro ao verificar telefone:", error);
      return false;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const currentPhone = docSnap.exists() ? docSnap.data().phone : "";

      if (values.phone !== currentPhone) {
        const phoneExists = await checkPhoneExists(values.phone, user.uid);
        if (phoneExists) {
          toast.error(
            "Este número de telefone já está sendo usado por outro usuário!"
          );
          setSubmitting(false);
          return;
        }
      }

      if (values.email !== user.email) {
        await updateEmail(user, values.email);
      }

      if (values.name !== user.displayName) {
        await updateProfile(user, { displayName: values.name });
      }

      await setDoc(doc(db, "users", user.uid), {
        phone: values.phone,
        email: values.email,
        displayName: values.name,
        address: values.address,
      });

      toast.success("Perfil atualizado com sucesso!");
      navigate("/main", { replace: true });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-left" />
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Perfil
          </h2>
          <p className="text-gray-600">
            Complete suas informações para uma experiência personalizada
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* CEP Search */}
                  <CepSearch
                    onAddressFound={(addressData) => {
                      setFieldValue(
                        "address",
                        `${addressData.street}, ${addressData.neighborhood}, ${addressData.city} - ${addressData.state}`
                      );
                      setAddressData(addressData);
                      setPopoverOpen(true);
                    }}
                  />
                  <AddressPopover
                    isOpen={popoverOpen}
                    onClose={() => setPopoverOpen(false)}
                    values={addressData || {}}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo:
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email:
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone:
                    </label>
                    <Field
                      name="phone"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço:
                    </label>
                    <Field
                      name="address"
                      type="text"
                      disabled={true}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Rua, bairro, cidade"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Salvar e Continuar
                        </div>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
