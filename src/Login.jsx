import React, { useState } from "react";
import { login } from "./utils/Login.util";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Handle successful login (e.g., redirect to dashboard)
      alert("Login successful!");
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
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

        {/* Right side with Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white shadow-lg">
          <div className="w-full max-w-md">
            <div class="max-w-md w-full p-6">
              <h2 className="text-3xl text-center font-bold text-gray-600 mb-6">
                Bem Vindo
              </h2>
              <h1 class="text-sm font-semibold mb-6 text-gray-500 text-center">
                Ajudando na sua jornada diaria{" "}
              </h1>
              <div class="mt-4 flex flex-col lg:flex-row items-center justify-between">
                <div class="w-full lg:w-1/2 mb-2 lg:mb-0">
                  <button
                    type="button"
                    class="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      class="w-4"
                      id="google"
                    >
                      <path
                        fill="#fbbb00"
                        d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                      ></path>
                      <path
                        fill="#518ef8"
                        d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                      ></path>
                      <path
                        fill="#28b446"
                        d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                      ></path>
                      <path
                        fill="#f14336"
                        d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                      ></path>
                    </svg>{" "}
                    Faça login com o Google{" "}
                  </button>
                </div>
                <div class="w-full lg:w-1/2 ml-0 lg:ml-2">
                  <button
                    type="button"
                    class="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      id="github"
                      class="w-4"
                    >
                      <path d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z"></path>
                    </svg>{" "}
                    Faça login com o Github{" "}
                  </button>
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-600 text-center">
                <p>ou use seu email e senha</p>
              </div>
              <form action="#" method="POST" class="space-y-4">
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    class="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <div class="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Já tem uma conta?{" "}
                  <a href="/register" class="text-black hover:underline">
                    Faça login aqui
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
