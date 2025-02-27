"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../../components/navBar";
import { createBlog } from "../../../utils/services/api.services";

const CreateBlog = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const { title, content } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog(title, content);
      toast.success("Blog created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to create blog. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-lg mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Create a Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter blog title"
              value={title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 shadow-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Blog Content
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your blog content here..."
              value={content}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 shadow-md"
              rows={20}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-500 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Create Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
