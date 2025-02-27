"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import { signIn } from "@/utils/services/api.services";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      await signIn(email, password)
        .then(() => {
          toast.success("Login Successful");
          router.push("/dashboard");
        })
        .catch((e) => {
          const error = e.toString();
          toast.error(error);
        });
    } else {
      toast.error("Please fill in all the inputs");
    }
  };

  return (
    <div>
      <div className="max-w-screen-xl mx-auto max-h-screen my-4 ">
        <div className="flex justify-center md:justify-start">
          <h1 className="text-4xl font-bold">Login</h1>
        </div>
        <div className="flex justify-around ">
          <div>
            <div className="my-16">
              <div className="font-poppins mb-12 ">
                <p className="font-bold text-gray-900 text-4xl tracking-normal">
                  Welcome Back,
                </p>
                <p className="font-bold text-purple-700 text-4xl tracking-normal">
                  Login
                </p>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 w-full mb-4"
                value={email}
                onChange={handleChangeEmail}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-2 w-full mb-4"
                value={password}
                onChange={handleChangePassword}
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  className="my-4 w-auto text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-xl text-xl px-12 py-2 text-center mr-2 mb-2 justify-center"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>

              <div className="my-2 flex text-sm text-purple-700 tracking-wide">
                <p className="font-normal">Don’t have an account? </p>
                <span
                  className="font-bold ml-2 cursor-pointer"
                  onClick={() => router.push("/auth/signup")}
                >
                  Register
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
