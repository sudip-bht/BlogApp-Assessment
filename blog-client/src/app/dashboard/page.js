"use client";
import { useEffect, useState } from "react";
import NavBar from "../../components/navBar";
import { fetchBlogs } from "../../utils/services/api.services";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  useEffect(() => {
    console.log("useEffect");
    const loadBlogs = async () => {
      await fetchBlogs(page).then((res) => {
        setBlogs(res.results);
        setTotalPages(Math.ceil(res.count / limit));
      });
    };
    loadBlogs();
  }, [page]);

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <div className="mt-4">
          {blogs.length === 0 ? (
            <p>No blogs available</p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="border p-4 my-2 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">{blog.title}</h3>
                <p>{blog.content.substring(0, 100)}...</p>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
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
    </div>
  );
}
