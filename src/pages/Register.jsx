import React, { useState } from "react";
import { register } from "../utils/Signin.util";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      // Handle successful registration (e.g., redirect to login)
      alert("Registration successful!");
    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Left side with Image */}
        <div
          className="w-1/2 bg-cover bg-center hidden lg:block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
          }}
        ></div>

        {/* Right side with Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white shadow-lg">
          <div className="w-full max-w-md">
            <h2 className="text-3xl text-center font-bold text-gray-600 mb-6">
              Crie a sua conta aqui e comece a usar o nosso app
            </h2>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Ajudando na sua jornada diaria
            </h1>
            <div className="mt-4 text-sm text-gray-600">
              <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  class="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Register
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Ao criar uma conta, você concorda com nossos Termos de Serviço e
                Política de Privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
