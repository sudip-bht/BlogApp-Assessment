"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../../../utils/services/api.services";
import { ToastContainer, toast } from "react-toastify";
const SignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    skills: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      await signUp(formData.userName, formData.email, formData.password)
        .then(() => router.push("/"))
        .catch((e) => toast.error("Email already registered"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleValidation = (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length === 0) handleSubmit();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-purple-700 text-center">
          Sign Up
        </h1>
        <p className="mt-2 text-center">
          Have an account?{" "}
          <a href="/" className="text-purple-600">
            Login In
          </a>
        </p>
        <form className="mt-4" onSubmit={handleValidation}>
          {[
            { type: "email", name: "email", placeholder: "Email" },
            { type: "text", name: "userName", placeholder: "Username" },
            { type: "password", name: "password", placeholder: "Password" },
            {
              type: "password",
              name: "confirmPassword",
              placeholder: "Confirm Password",
            },
          ].map(({ type, name, placeholder }) => (
            <div key={name} className="mt-4">
              <input
                className="w-100 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-300 shadow-md"
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
              />
              {errors[name] && (
                <p className="text-red-500 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
