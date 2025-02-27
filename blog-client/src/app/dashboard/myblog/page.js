"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../../components/navBar";
import {
  updateBlog,
  fetchBlogsByUser,
  deleteblog,
} from "../../../utils/services/api.services";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editBlog, setEditBlog] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const limit = 10;
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        await fetchBlogsByUser(page).then((res) => {
          setBlogs(res.results);

          setTotalPages(Math.ceil(res.count / limit));
        });
      } catch (error) {
        toast.error("Failed to load blogs.");
      }
    };
    fetchBlogs();
  }, [page]);

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setFormData({ title: blog.title, content: blog.content });
  };
  const handleDelete = async (blog) => {
    try {
      await deleteblog(blog.id);
      toast.success("Blog Deleted successfully!");

      // Remove the deleted blog from the UI
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete blog.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editBlog) return;

    try {
      await updateBlog(editBlog.id, formData.title, formData.content);
      toast.success("Blog updated successfully!");
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b.id === editBlog.id ? { ...b, ...formData } : b))
      );

      setEditBlog(null);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update blog.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">My Blogs</h2>
        <div className="mt-4">
          {blogs.length === 0 ? (
            <p>No blogs found</p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="border p-4 my-2 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">{blog.title}</h3>
                <p>{blog.content.substring(0, 100)}...</p>
                <></>
                <button
                  onClick={() => handleEdit(blog)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog)}
                  className=" ml-2 mt-2 px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {editBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Blog</h3>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              placeholder="Blog Title"
              required
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
              placeholder="Blog Content"
              required
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setEditBlog(null)}
                className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
