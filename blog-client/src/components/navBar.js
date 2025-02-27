"use client";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();

  return (
    <nav className="bg-purple-600 text-white py-3 px-6 flex justify-between">
      <h1 className="text-lg font-bold">Blog-App</h1>
      <div className="space-x-6">
        <button
          onClick={() => router.push("/dashboard")}
          className=" hover:text-gray-300"
        >
          Home
        </button>
        <button
          onClick={() => router.push("/dashboard/createblog")}
          className="hover:text-gray-300"
        >
          Create Blog
        </button>
        <button
          onClick={() => router.push("/dashboard/myblog")}
          className=" hover:text-gray-300"
        >
          My Blogs
        </button>
      </div>
      <div>
        <button
          onClick={() => router.push("/")}
          className=" hover:text-gray-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
